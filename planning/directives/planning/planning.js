;(function (angular, moment, _) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanning', PlanningDirective)

  PlanningController.$inject = ['$scope', 'planningConfiguration']

  function PlanningController ($scope, planningConfiguration) {
    var BASE_SIZE = planningConfiguration.BASE_SIZE

    var self = this

    function init () {
      self.zoom = parseInt(self.zoom)

      self.allowedDays = planningConfiguration.DAYS

      if (!self.zoom || self.zoom < 1) {
        self.zoom = 1
      }

      self._dayStart = self.dayStart ? parseTime(self.dayStart) : parseTime(0)
      self._dayEnd = self.dayEnd ? parseTime(self.dayEnd) : parseTime(24)
      self.width = (self.zoom * (parseInt(self._dayEnd.h) - parseInt(self._dayStart.h) + 1) * BASE_SIZE) + 'px'
      self.sortedEvents = undefined
      if (self.mode === 'week') {
        self._events = (_.flatten(_.map(self.events, split)))
        self._events = filter(self._events)

        self.sortedEvents = _.groupBy(self._events, function (e) {
          return e.start.dayOfYear()
        })

        addMissingDays(self.sortedEvents)
      } else if (self.mode === 'day' || self.mode === 'week-advanced') {
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
            addMissingDays(sorted)
            return sorted
          })
        }
        addMissingEntities(self.sortedEvents)
       // console.log(self.sortedEvents)
      } else if (self.mode === 'month') {
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

        for (var i = 0; i < 5; i++) {
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
      }
    }

    init()

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
      if (event.start.month() < self.position.month()) {
        // Event starts before our current month
        if (event.end.month() < self.position.month()) {
          // Event also ends before. Return nothing
          return []
        }
        // Set the beginning at the start of the month
        event.start = moment(self.position).startOf('month')
      }
      if (event.end.month() > self.position.month()) {
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
        if (self.mode === 'week' || self.mode === 'week-advanced') {
          start = moment(self.position).weekday(0).hour(self._dayStart.h).minute(self._dayStart.m).second(0)
          stop = moment(self.position).weekday(6).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59)
        } else if (self.mode === 'day') {
          start = moment(self.position).hour(self._dayStart.h).minute(self._dayStart.m).second(0)
          stop = moment(self.position).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59)
        } else if (self.mode === 'month') {
          start = moment(self.position).date(1).hour(self._dayStart.h).minute(self._dayStart.m).second(0)
          stop = moment(self.position).weekday(moment(self.position).daysInMonth()).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59)
        }
        return e.start.isBetween(start, stop) || e.end.isBetween(start, stop)
      })
    }

    function addMissingDays (sortedEvents) {
      sortedEvents = sortedEvents || {}
      var startingDay = moment(self.position).weekday(0).dayOfYear()
      _.times(7, function (i) {
        /* Handle week overlapping two years by adding days #366, #367, etc
         *  And remove day #1, 2, etc
         *  To prevent them from appearing on top
         * */
        if (startingDay >= 358 && sortedEvents[i]) {
          sortedEvents[startingDay + 5 + i] = sortedEvents[i]
          delete sortedEvents[i]
        }
        if (!sortedEvents[startingDay + i]) {
          sortedEvents[startingDay + i] = []
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
      if (self.mode === 'week') {
        return Object.keys(sortedEvents)
      } else if (self.mode === 'day') {
        return Object.keys(sortedEvents).sort()
      }
    }

    function getEvents (key) {
      return self.sortedEvents[key]
    }

    $scope.$watchCollection(function () {
      return [self.events, self.entities, self.position, self.mode, self.dayStart, self.dayEnd, self.zoom]
    }, init)

    function isToday (n) {
      return self.position.week() === moment().week() && n === moment().dayOfYear()
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

    function clickCallbackWrapper (h, m, d) {
      var mom
      if (self.mode === 'week') {
        mom = moment(self.position).hour(h).minute(m).second(0).dayOfYear(d)
      } else if (self.mode === 'day') {
        mom = moment(self.position).hour(h).minute(m)
      }
      self.clickCallback({ $moment: mom, $entity: self.mode === 'day' ? d : undefined })
    }

    function clickWeekEvent (day, $event) {
      if (day.date) {
        self.clickCallback({ $moment: day.date })
      }
    }

    function dropEventWeekMode (h, m, d, $data, $event) {
      var mom
      if (self.mode === 'week') {
        mom = moment(self.position).hour(h).minute(m).second(0).dayOfYear(d)
      } else if (self.mode === 'day') {
        mom = moment(self.position).hour(h).minute(m)
      }
      self.dropCallback({ $moment: mom, $data: $data, $event: $event, $entity: self.mode === 'day' ? d : undefined })
    }

    function dropEvent (data, event, moment) {
      self.dropCallback({ $data: data, $event: event, $moment: moment })
    }

    _.extend(self, {
      //  sortedEvents       : sortedEvents,
      isToday: isToday,
      currentTimeToPixels: currentTimeToPixels,
      isCurrent: isCurrent,
      clickCallbackWrapper: clickCallbackWrapper,
      isInDayRange: isInDayRange,
      keys: keys,
      getEvents: getEvents,
      clickWeekEvent: clickWeekEvent,
      dropEvent: dropEvent,
      dropEventWeekMode: dropEventWeekMode
    })
  }

  function PlanningDirective () {
    return {
      restrict: 'E',
      templateUrl: 'planning/directives/planning/planning.html',
      controller: PlanningController,
      controllerAs: 'planning',
      bindToController: {
        zoom: '=',
        events: '=',
        entities: '=',
        position: '=',
        mode: '=',
        dayStart: '=',
        dayEnd: '=',
        dayField: '=',
        eventCallback: '&',
        dayCallback: '&',
        clickCallback: '&',
        weekEventCallback: '&',
        dropCallback: '&'
      },
      scope: {}
    }
  }
})(window.angular, window.moment, window._)
