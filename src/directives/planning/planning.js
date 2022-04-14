;(function (angular, moment, _) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanning', PlanningDirective)

  PlanningController.$inject = ['$scope', 'planningConfiguration']

  function PlanningController ($scope, planningConfiguration) {
    var BASE_SIZE = planningConfiguration.BASE_SIZE

    var self = this

    self.$onInit = function () {
      _.extend(self, {
        //  sortedEvents       : sortedEvents,
        isToday: isToday,
        currentTimeToPixels: currentTimeToPixels,
        isCurrent: isCurrent,
        clickCallbackWrapper: clickCallbackWrapper,
        showAbsencesCallBackWrapper: showAbsencesCallBackWrapper,
        isInDayRange: isInDayRange,
        keys: keys,
        getEvents: getEvents,
        clickWeekEvent: clickWeekEvent,
        dropEvent: dropEvent,
        isFerie: isFerie,
        hasAbsence: hasAbsence,
        getName: getName
      })

      init()
    }

    function init () {
      self.zoom = parseInt(self.zoom)
      self.allowedDays = self.usableDays.sort() || planningConfiguration.DAYS
      self.daysList = self.allowedDays.map(function (i) {
        var d = moment(self.position)
        d.weekday(i)
        return d
      })

      if (!self.zoom || self.zoom < 1) {
        self.zoom = 1
      }

      self._dayStart = self.dayStart ? parseTime(self.dayStart) : parseTime(0)
      self._dayEnd = self.dayEnd ? parseTime(self.dayEnd) : parseTime(24)
      self.width = (self.zoom * (parseInt(self._dayEnd.h) - parseInt(self._dayStart.h) + 1) * BASE_SIZE) + 'px'
      self.sortedEvents = undefined
      switch (self.mode) {
        case 'week':
          self._events = (_.flatten(_.map(self.events, split)))
          self._events = filter(self._events)

          self.sortedEvents = _.groupBy(self._events, function (e) {
            return e.start.format('DD/MM/YYYY')
          })
          addMissingDays(self.sortedEvents)
          break
        case 'day':
        case 'week-advanced':
          self._events = (_.flatten(_.map(self.events, split)))
          self._events = filter(self._events)
          self.sortedEvents = _.groupBy(self._events, function (e) {
            return e[self.dayField]
          })
          /* If we are in advanced week mode, we have a double grouping: first by technician, then by day of week */
          if (self.mode === 'week-advanced') {
            self.sortedEvents = _.mapValues(self.sortedEvents, function (eventsByTechnician) {
              return _.groupBy(eventsByTechnician, function (e) {
                return e.start.weekday()
              })
            })
          }
          addMissingEntities(self.sortedEvents)
          break
        case '3day':
          self._events = (_.flatten(_.map(self.events, split)))
          self._events = filter(self._events)
          self.sortedEvents = _.reduce(self.entities, function (acc, v) {
            acc[v] = []
            return acc
          }, {})

          var keys = _.keys(self.sortedEvents)
          self.groupedEvents = _.map(_.groupBy(self._events, function (e) {
            return moment(e.start).startOf('day').unix()
          }), function (v, k) {
            var result = {
              key: k,
              date: moment.unix(k).startOf('day').toDate(),
              day: moment.unix(k).startOf('day').format('dddd DD MMMM'),
              value: _.groupBy(v, function (e) {
                return e.technician
              }),
              absences: angular.copy(self.absences)
            }
            _.each(self.entities, function (e) {
              if (!result.value[e]) {
                result.value[e] = []
              }
            })
            return result
          })

          var start = moment(self.position).hour(self._dayStart.h).minute(self._dayStart.m).second(0)
          var stop = moment(self.position).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59)
          var days = [{start: angular.copy(start), end: angular.copy(stop)}]

          var j = 0
          while (j < 2) {
            stop.add(1, 'day')
            var d = stop.day() - 1
            if (d < 0) {
              d = 6
            }
            if (_.isEmpty(self.allowedDays) || _.includes(self.allowedDays, d)) {
              days.push({start: angular.copy(stop).hour(self._dayStart.h).minute(self._dayStart.m).second(0), end: angular.copy(stop).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59)})
              j++
            }
          }

          _.each(days, function (d) {
            var date = "" + moment(d.start).startOf('day').unix()

            var found = _.find(self.groupedEvents, function (group) {
              return group.key === date
            })

            if (!found) {
              var obj = {
                key: date,
                date: moment(angular.copy(d.start)).startOf('day').toDate(),
                day: moment(angular.copy(d.start)).startOf('day').format('dddd DD MMMM'),
                value: {},
                absences: angular.copy(self.absences)
              }
              _.each(_.keys(self.sortedEvents), function (k) {
                obj.value[k] = []
              })
              self.groupedEvents.push(obj)
            }
          })
          self.groupedEvents = _.sortBy(self.groupedEvents, function (e) {
            return e.key
          })
          break
        case 'month':
          var firstDay = moment(self.position).date(1).hours(0).minutes(0).seconds(0)
          self.month = moment(self.position).date(1).hours(0).minutes(0).seconds(0).format('MMMM')
          self.decallage = firstDay.isoWeekday() - 1 //

          if (self.decallage < 0) {
            self.decallage = 0
          }
          self.oneDayEvents = _(self.events)
            .filter(function (event) {
              return event.start.dayOfYear() === event.end.dayOfYear() && event.start.month() === moment(self.position).month()
            })
            .groupBy(
              function (event) { return Math.floor((event.start.date() + self.decallage) / 7.01) }) // 7.01 -> Fix issue when start day = 7 (sunday)
            .value()
          self.multipleDaysEvents = _(self.events)
            .filter(function (event) {
              return event.start.dayOfYear() !== event.end.dayOfYear()
            })
            .map(splitByWeeks)
            .flatten()
            .groupBy(function (event) {
              return Math.floor((event.start.date() + self.decallage) / 7.01) // 7.01 -> Fix issue when start day = 7 (sunday)
            })
            .value()


          var endWeek = moment(self.position).endOf('month').isoWeek()
          var startWeek = moment(self.position).startOf('month').isoWeek()
          // When switching years, last week of month can be 1
          if (endWeek === 1) {
            endWeek = moment(self.position).isoWeeksInYear() + 1
          }
          if (endWeek < startWeek) {
            endWeek = startWeek + endWeek
          }
          var weekInMonth = endWeek - startWeek + 1
          for (var i = 0; i < weekInMonth; i++) {
            if (self.multipleDaysEvents[i] === undefined) {
              self.multipleDaysEvents[i] = []
            }
          }
          self.days = []
          // Add day from previous month
          if (firstDay.isoWeekday() - 1 > 0) {
            for (i = 0; i < firstDay.isoWeekday() - 1; i++) {
              self.days.unshift({})
            }
          }
          _.times(firstDay.daysInMonth(), function (n) {
            var day = moment(firstDay).add(n, 'days')
            self.days.push({ date: day, events: [] })
          })

          var displayedDaysCount = (self.days.length > 35 ? 42 : 35)
          while (self.days.length < displayedDaysCount) {
            self.days.push({})
          }
          break
      }
    }

    function getName(id) {
      return self.entitiesName.find((el) => el._id === id).fullname
    }

    function split (event) {
      // Event starts and ends the same day
      event = angular.copy(event)

      var start = moment(event.start).hour(self._dayStart.h).minute(self._dayStart.m).second(0)
      var stop = moment(event.end).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59)
      if (event.start.dayOfYear() === event.end.dayOfYear()) {
        // reset the boundaries if they exceed the one fixed.
        // And trim events that are entirely out of the boundaries
        if (event.start.isBefore(start)) {
          if (event.end.isBefore(start)) {
            return []
          }
          event.start = start
        }
        if (event.end.isAfter(stop)) {
          if (event.start.isAfter(stop)) {
            return []
          }
          event.end = stop
        }
        return [event]
      }
      // Event is on several days.
      // Build a first event that ends at the end of the first day
      var first_event = angular.copy(event)
      first_event.end = moment(event.start).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59)
      if (event.start.isBefore(start)) {
        first_event.start = start
      }

      var startNextDay = moment(event.start).add(1, 'day').hour(self._dayStart.h).minute(self._dayStart.m)
      var endThisDay = moment(event.start).hour(self._dayEnd.h).minute(self._dayEnd.m)
      if (event.end.isBefore(startNextDay)) {
        if (first_event.start.isAfter(endThisDay)) {
          return []
        }
        // Event finishes before start hour next day. No need to create another one
        return [first_event]
      }
      first_event.continuedAfter = true

      // Build a second event that starts at the beginning of the following days.
      // This event may end several days later. Recursion will handle it
      var second_event = angular.copy(event)
      second_event.start = moment(event.start).add(1, 'day').hour(self._dayStart.h).minute(self._dayStart.m)
      second_event.continuedBefore = true

      if (event.start.isAfter(endThisDay)) {
        // If the first event starts after curfew, don't add it
        return split(second_event)
      }

      return [first_event].concat(split(second_event))
    }

    function splitByWeeks (event) {
      if (event.start.isAfter(event.end)) {
        var st = event.start
        event.start = event.end
        event.end = st
      }

      if (event.start.year() < self.position.year() || event.start.month() < self.position.month()) {
        // Event starts before our current month
        if (event.end.year() < self.position.year() || event.end.month() < self.position.month()) {
          // Event also ends before. Return nothing
          return []
        }
        // Set the beginning at the start of the month
        event.start = moment(self.position).startOf('month')
      }
      if (event.end.month() > self.position.month() || event.end.year() !== self.position.year()) {
        // Event ends after current month
        if (event.start.month() > self.position.month()) {
          return []
        }
        event.end = moment(self.position).endOf('month')
      }
      // console.info(_.cloneDeep(event))
      if (event.start.isoWeek() === event.end.isoWeek()) {
        // If our event is on one week, we're all set
        return [event]
      }

      // Split
      var firstEvent = angular.copy(event)
      var secondEvent = angular.copy(event)
      // make it end on the same week
      firstEvent.continuedAfter = true
      secondEvent.continuedBefore = true
      firstEvent.end = moment(firstEvent.start).endOf('week')
      secondEvent.start.add(1, 'week').startOf('week')
      // Recursion will handle potential split needed by second event
      return [firstEvent].concat(splitByWeeks(secondEvent))
    }

    function filter (events) { // remove event not in range (month, week, day)
      return _.filter(events, function (e) {
        var start, stop
        switch (self.mode) {
          case 'week':
          case 'week-advanced':
            start = moment(self.position).weekday(0).hour(self._dayStart.h).minute(self._dayStart.m).second(0)
            stop = moment(self.position).weekday(6).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59)
            break
          case 'day':
            start = moment(self.position).startOf('day').hour(self._dayStart.h).minute(self._dayStart.m)
            stop = moment(self.position).endOf('day').hour(self._dayEnd.h).minute(self._dayEnd.m)
            break
          case '3day':
            start = moment(self.position).hour(self._dayStart.h).minute(self._dayStart.m).second(0)
            stop = moment(self.position).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59)
            var days = [{start: angular.copy(start), end: angular.copy(stop)}]

            var i = 0
            while (i < 2) {
              stop.add(1, 'day')
              var d = stop.day() - 1
              if (d < 0) {
                d = 6
              }
              if (_.isEmpty(self.allowedDays) || _.includes(self.allowedDays, d)) {
                days.push({start: angular.copy(stop).hour(self._dayStart.h).minute(self._dayStart.m).second(0), end: angular.copy(stop).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59)})
                i++
              }
            }
            return _.some(days, function (d) {
              return e.start.isBetween(d.start, d.end) || e.end.isBetween(d.start, d.end)
            })
          case 'month':
            start = moment(self.position).date(1).hour(self._dayStart.h).minute(self._dayStart.m).second(0)
            stop = moment(self.position).weekday(moment(self.position).daysInMonth()).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59)
            break
        }
        return e.start.isBetween(start, stop) || e.end.isBetween(start, stop)
      })
    }

    function addMissingDays (sortedEvents) {
      sortedEvents = sortedEvents || {}
      var startingDay = moment(self.position).weekday(0)
      _.times(7, function (i) {
        var newDate = moment(angular.copy(startingDay)).add(i, 'days').format('DD/MM/YYYY')
        if (!sortedEvents[newDate]) {
          sortedEvents[newDate] = []
        }
      })
    }

    function addMissingEntities (sortedEvents) {
      sortedEvents = sortedEvents || {}
      _.each(self.entities, function (e) {
        if (!sortedEvents[e]) {
          sortedEvents[e] = []
        }
      })
    }

    function parseTime (h) {
      if (h >= 24) {
        return { h: 23, m: 59 }
      }
      return { h: h, m: 0 }
    }

    function keys (sortedEvents) {
      switch (self.mode) {
        case 'week':
          return Object.keys(sortedEvents).sort(function(a, b) {
            var dateA = dateFromString(a)
            var dateB = dateFromString(b)
            return dateA - dateB
          })
        case 'week-advanced':
        case 'day':
        case '3day':
          return Object.keys(sortedEvents).sort()
      }
    }

    function getEvents (key) {
      return self.sortedEvents[key]
    }

    $scope.$watchCollection(function () {
      return [self.events, self.entities, self.position, self.mode, self.dayStart, self.dayEnd, self.zoom, self.usableDays]
    }, init)

    function isToday (n) {
      return self.position.week() === moment().week() && n === moment().dayOfYear()
    }

    function isFerie (day) {
      if(self.holidays) {
        return self.holidays.find(holiday => moment(holiday.date).format('L') === moment(day).format('L'));
      }
    }

    function hasAbsence (date) {
      var d = moment(angular.copy(date))
      return _.any(self._absences, function (abs) {
        return abs.range.contains(d)
      })
    }

    function isInDayRange () {
      return moment().hour() > parseInt(self._dayStart.h) && moment().hour() < parseInt(self._dayEnd.h)
    }

    function currentTimeToPixels () {
      var totalMinutes = (moment().hour() - parseInt(self._dayStart ? self._dayStart.h : 0)) * 60 + moment().minutes()
      return Math.floor(self.zoom * (BASE_SIZE * totalMinutes) / 60)
    }

    function isCurrent () {
      return self.position.isSame(moment(), self.mode)
    }

    function clickCallbackWrapper (opts) {
      var mom
      var entity
      switch (self.mode) {
        case 'week':
          var split = opts.d.split('/')
          /**
           * split[2] === year
           * split[1] === month, we need to subtract 1 because momentJS months starts at 0
           * split[0] === dayOfMonth
           */
          mom = moment(new Date(split[2], split[1] - 1, split[0], opts.h, opts.m))
          break
        case '3day':
        case 'day':
          mom = moment(self.position).hour(opts.h).minute(opts.m)
          entity = opts.entity
          break
        case 'week-advanced':
          entity = opts.entity
          mom = moment(self.position).hour(opts.h).minute(opts.m).second(0).weekday(opts.d)
          break
      }
      self.clickCallback({ $moment: mom, $entity: entity })
    }

    function clickWeekEvent (day, $event) {
      if (day.date) {
        self.clickCallback({ $moment: day.date })
      }
    }

    function showAbsencesCallBackWrapper (absences, day) {
      self.showAbsencesCallback({$absences: absences, $day: day})
    }

    function dropEvent (config) {
      var mom = config.moment
      if (!mom) {
        switch (self.mode) {
          case 'week':
            var doy = moment(dateFromString(config.d)).dayOfYear()
            mom = moment(self.position).hour(config.h).minute(config.m).second(0).dayOfYear(doy)
            break
          case 'week-advanced':
            mom = moment(self.position).hour(config.h).minute(config.m).second(0).weekday(config.d)
            break
          case 'day':
            mom = moment(self.position).hour(config.h).minute(config.m)
            break
          case '3day':
            mom = moment.unix(config.day).hour(config.h).minute(config.m)
        }
      }
      var entity = (_.includes(['week-advanced', 'day', '3day'], self.mode)) ? config.entity : undefined
      if((self.mode === 'month') && isFerie(mom)) {
        planningConfiguration.isFerieCallback(function () {
          self.dropCallback({ $moment: mom, $data: config.$data, $event: config.$event, $entity: entity })
        })
      } else {
        self.dropCallback({ $moment: mom, $data: config.$data, $event: config.$event, $entity: entity })
      }
    }

    function calculateAdvancedWeekContainerHeight () {
      return (parseInt(self.zoom) * Math.max(planningConfiguration.BASE_SIZE - 8, 1)) + 'px'
    }

    function dateFromString (date) {
      var dateSplitted = date.split('/')
      return new Date(dateSplitted[2], dateSplitted[1] - 1, dateSplitted[0])
    }

  }

  function PlanningDirective () {
    return {
      restrict: 'E',
      templateUrl: '/directives/planning/planning.html',
      controller: PlanningController,
      controllerAs: 'planning',
      bindToController: {
        zoom: '=',
        events: '=',
        entities: '=',
        entitiesName: '=',
        entitiesPauses: '=?',
        absences: '=?',
        position: '=',
        mode: '=',
        dayStart: '=',
        dayEnd: '=',
        dayField: '=',
        eventCallback: '&',
        dayCallback: '&',
        clickCallback: '&',
        weekEventCallback: '&',
        dropCallback: '&',
        usableDays: '=?',
        action: '&?',
        holidays: '=',
        showAbsencesCallback: '&'
      },
      scope: {}
    }
  }
})(window.angular, window.moment, window._)
