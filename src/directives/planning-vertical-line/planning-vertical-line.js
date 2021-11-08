;(function (angular, _, moment) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanningVerticalLine', PlanningLineDirective)

  PlanningLineController.$inject = ['$filter', '$scope', 'planningConfiguration', 'PositionService', 'ColorService', 'PauseService', 'AbsenceService']

  /**
   *
   */
  function
  PlanningLineController ($filter, $scope, planningConfiguration, PositionService, ColorService, PauseService, AbsenceService) {


    /** BASE_SIZE is the span of an hour. It gets multiplied by zoom (default 10) to get the size in pixel
     * in vertical mode, we need to reduce it since we have much less space
     */
    var BASE_SIZE = Math.max(planningConfiguration.BASE_SIZE - 8, 1)
    var parallelText = planningConfiguration.parallelText
    var MAX_PARALLEL = planningConfiguration.MAX_PARALLEL
    var AVAILABLE_SPACE = 90 // Total horizontal space taken by the events

    var self = this

    self.$onInit = function () {
      $scope.$watchCollection(function () {
        return [self.events, self.dayStart, self.dayEnd]
      }, init)

      $scope.$watchCollection(function () {
        return self.absences
      }, function (oldValue, newValue) {
        if (Array.isArray(self.absences) && self.absences.length) {
          var start = moment(angular.copy(self.day)).startOf('day')
          var end = moment(angular.copy(self.day)).endOf('day')
          self._absences = AbsenceService.parseAbsences(angular.copy(self.absences), [start, end]).map(function (abs) {
            abs.style = {
              height: self.zoom * self.SLIDER_WIDTH * (moment.range(abs.start, abs.end).valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px'
            }

            abs.range = moment.range(abs.start, abs.end)
            abs.class = 'planning-absence-' + abs.confirmation.state
            abs.tooltip = setAbsenceTooltip(abs)
            return abs
          })
        } else {
          self._absences = []
        }
      })


      _.extend(self, {
        clickEvent: clickEvent,
        calcWidth: calcWidth,
        dropEvent: dropEvent,
        hoverAbsence: hoverAbsence,
        leaveLine: leaveLine
      })

      init()
    }

    self.log = function (a) {
    }

    self.replace = function (string) {
      if (!string) return
      return string.replace(/([a-zA-Z\ ])\w+/, '')
    }

    self.preEvent = {}
    self.postEvent = {}

    function setAbsenceTooltip(abs) {
      let state = ''
      const absenceType = abs.absenceType
      switch (abs.confirmation.state) {
          case 'sending':
              state = 'Absence envoyée'
              break
          case 'pending':
              state = 'Absence en cour de traitement'
              break
          case 'partial-accepted':
              state = 'Absence en cour de traitement'
              break;
          case 'accepted':
              state = 'Absence acceptée'
              break
      }
      if(absenceType) {
          return state + '\nRaison:'+ absenceType
      } else {
          return state
      }
    }

    function extractMinutesFromEvent($event){
      var minutes
      if (_.contains($event.target.classList, 'half-hour')) {
        // If the user has clicked right on the half-hour line, offsetX is 0
        minutes = 30
      } else {
        minutes = Math.floor($event.offsetY / (BASE_SIZE * self.zoom) * 6)*10
      }
      return minutes
    }

    function dropEvent (data, event) {
      var hour = parseInt(event.target.getAttribute('hour'))
      var minutes = extractMinutesFromEvent(event)
      var date = moment(angular.copy(self.day)).hours(hour + parseInt(self.dayStart.h)).minutes(minutes)
      var day = moment(angular.copy(self.position))
      if (checkAbsence(date) && checkFerie(day)) {
        planningConfiguration.warningCallback(function () {
          self.dropCallback({ $data: data, $event: event, $hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        })
      } else if (checkAbsence(date) && !checkFerie(day)) {
        planningConfiguration.absentTechnicianCallback(function () {
          self.dropCallback({ $data: data, $event: event, $hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        })
      } else if (!checkAbsence(date) && checkFerie(day)) {
        planningConfiguration.isFerieCallback(function () {
          self.dropCallback({ $data: data, $event: event, $hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        })
      } else {
        self.dropCallback({ $data: data, $event: event, $hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
      }

    }

    function hoverAbsence() {
      for (const iterator of document.getElementsByClassName('absence')) {
        iterator.classList.add('absence-week-advanced-hover')
      }
    }

    function leaveLine() {
      for (const iterator of document.getElementsByClassName('absence')) {
        iterator.classList.remove('absence-week-advanced-hover')
      }
    }

    function clickEvent (hour, $event, line) {
      var minutes = extractMinutesFromEvent($event)
      var date = moment(angular.copy(self.day)).hours(hour + parseInt(self.dayStart.h)).minutes(minutes)
      if (checkAbsence(date) && checkFerie(line)) {
        planningConfiguration.warningCallback(function () {
          self.clickCallback({$hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        })
      } else if (checkAbsence(date) && !checkFerie(line)) {
        planningConfiguration.absentTechnicianCallback(function () {
          self.clickCallback({$hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        })
      } else if (!checkAbsence(date) && checkFerie(line)) {
        planningConfiguration.isFerieCallback(function () {
          self.clickCallback({$hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        })
      } else {
        self.clickCallback({$hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
      }

    }

    function init () {
      var currentId = 0
      //     self.SLIDER_WIDTH   = 24 * BASE_SIZE
      self.preEvent = {}
      self.breaks = []

      self._events = angular.copy(self.events)
      self.range = self.dayEnd.h - self.dayStart.h
      self.SECONDS_BY_DAY = 3600 * self.range
      self.SLIDER_WIDTH = BASE_SIZE * self.range

      // Pre-sort events by start Date
      self._events = _.sortBy(self._events, function (e) {
        return e.start.valueOf()
      })

      var lines = [[]]
      var toremove = []
      _.each(self._events, function (event) {
        var style = {}
        event.depth = 1
        event.range = moment.range(event.start, event.end)
        if (event.range < 900000) {
          var end = moment(event.start).add(15, 'minutes')
          event.range = moment.range(event.start, end)
        }
        style.left = (event.start.hours() - self.dayStart.h) * BASE_SIZE * self.zoom + event.start.minutes() * BASE_SIZE * self.zoom / 60 + 'px'
        //   style.left                = event.start.hours() * 150 + event.start.minutes() * 150 / 60 + 'px'
        style.width = self.zoom * self.SLIDER_WIDTH * (event.range) / self.SECONDS_BY_DAY / 1000 + 'px'
        style['background-color'] = event['background-color'] || '#778899'
        if (ColorService.getLuminance(style['background-color'])> 200){
          style.color = 'black'
        } else {
          style.color = 'white'
        }
        event.style = style
        PositionService.overlap(lines, event, MAX_PARALLEL, toremove)
      })
      self._events = _.difference(self._events, toremove)
      _.each(self._events, function (event) {
        event.id = angular.copy(currentId)
        if (event.line === MAX_PARALLEL) {
          event.style.left = (event.start.hours() - self.dayStart.h) * BASE_SIZE * self.zoom + event.start.minutes() * BASE_SIZE * self.zoom / 60 + 'px'
          event.style.width = self.zoom * self.SLIDER_WIDTH * (event.range.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px'
          event.style['background-color'] = '#000'
          event.style['font-weight'] = 'bold'
          event.title = (event.eventList.length) + ' ' + parallelText
          event.style.color = '#fff'
          if (event.tooltip) event.tooltip = event.title
        }
        event.style.width = self.zoom * self.SLIDER_WIDTH * (event.range.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px'
        if (event.line === undefined) event.line = MAX_PARALLEL
        event.style.top = Math.round((parseInt(event.line)) * AVAILABLE_SPACE / lines.length) + '%'
        event.style.height = Math.round(AVAILABLE_SPACE / lines.length) + '%'
        event.percentage = '100%'
        if (event.continuedBefore) event.pre = 0
        if (event.pre > 0) {
          event.style['border-left'] = 'none'
          var s = moment(event.start).subtract(event.pre, 'minutes')
          if (!moment(s).isSame(event.start, 'day')) {
            s = moment(event.start).startOf('day')
          }
          var e = moment(event.start)
          var r = moment.range(s, e)
          var totalRange = moment.range(s, event.range.end)
          var percentage = r.valueOf() / totalRange.valueOf() * 100
          event.percentage = (100 - percentage) + '%'
          var obj = {
            percentage: (percentage) + '%',
            style: {
              left: (((moment(s).hours() - self.dayStart.h) * BASE_SIZE * self.zoom + (moment(s).minutes()) * BASE_SIZE * self.zoom / 60)) +  'px',
              width: self.zoom * self.SLIDER_WIDTH * (r.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px',
              top: event.style.top,
              height: event.style.height,
              totalWidth: self.zoom * self.SLIDER_WIDTH * (totalRange.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px',
              'text-align': 'center',
              color: '#fff',
              'background' : 'repeating-linear-gradient(45deg, ' +  event['background-color']  + ', ' +  event['background-color']  + ' 10px, white 10px, white 20px)',
              'border-top': '1px lightgrey solid',
              'border-bottom': '1px lightgrey solid',
              'border-left': '1px lightgrey solid'
            },
            tooltip: 'Trajet estimé de ' + event.pre + ' min'
          }
          if (percentage > 0) {
            self.preEvent[event.id] = obj
          } else {
            event.pre = 0
          }
        }
        generatePostEvent(event)
        if (event.pauses) {
          event.style['background-image'] = PauseService.generateGradient(event, 'to bottom')
          event.style['background-color'] = undefined
        }
        const pre = self.preEvent[event.id]
        const post = self.postEvent[event.id]
        event.style.totalWidth = (safeParse(event.style.width) + safeParse(_.get(pre, 'style.width')) + safeParse(_.get(post, 'style.width')) + 1) + 'px'
        currentId++
      })
      if (self.pauses) {
        createBreaks()
      }
      calculateContainerHeight()
    }

    function safeParse (width = '0px') {
      return parseInt(width.replace('px', ''))
    }

    function generatePostEvent (event) {
      if (!event.post) {
        return null
      }
      let end = moment(event.end).add(event.post, 'minutes')
      if (!moment(end).isSame(event.end, 'day')) {
        end = moment(event.end).endOf('day')
      }
      const start = moment(event.end)
      const range = moment.range(start, end)
      const totalRange = moment.range(event.range.start, event.range.end)
      const percentage = range.valueOf() / totalRange.valueOf() * 100
      event.postPercentage = (100 - percentage) + '%'
      var obj = {
        percentage: (percentage) + '%',
        style: {
          left: (((moment(start).hours() - self.dayStart.h) * BASE_SIZE * self.zoom + (moment(start).minutes()) * BASE_SIZE * self.zoom / 60) + 2) +  'px',
          width: self.zoom * self.SLIDER_WIDTH * (range.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px',
          top: event.style.top,
          height: event.style.height,
          totalWidth: self.zoom * self.SLIDER_WIDTH * (totalRange.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px',
          'text-align': 'center',
          color: '#fff',
          'background' : 'repeating-linear-gradient(135deg, ' +  event['background-color']  + ', ' +  event['background-color']  + ' 10px, white 10px, white 20px)',
          'border-top': '1px lightgrey solid',
          'border-bottom': '1px lightgrey solid',
          'border-left': '1px lightgrey solid'
        },
        tooltip: 'Trajet retour de ' + event.post + ' min'
      }
      if (percentage > 0) {
        self.postEvent[event.id] = obj
      } else {
        event.post = 0
      }
    }

    function calcWidth (zoom) {
      return (parseInt(zoom) * BASE_SIZE) + 'px'
    }

    function createBreaks () {
      self.breaks = _.compact(_.map(self.pauses.breaks, function (p) {
        var pause = {
          name: p.name,
          start: moment().hours(p.start.split(':')[0]).minute(p.start.split(':')[1]).second(0),
          end: moment().hours(p.end.split(':')[0]).minute(p.end.split(':')[1]).second(0),
          style: {}
        }

        if (pause.start.isAfter(self.dayEnd) || pause.end.isBefore(self.dayStart)) {
          return
        }
        if (pause.start.isBefore(self.dayStart)) {
          pause.start = moment(angular.copy(self.dayStart))
        }

        if (pause.end.isAfter(self.dayEnd)) {
          pause.end = moment(angular.copy(self.dayEnd))
        }

        pause.style.top = (((moment(pause.start).hours() - self.dayStart.h) * BASE_SIZE * self.zoom + (moment(pause.start).minutes()) * BASE_SIZE * self.zoom / 60)) +  'px'
        pause.style.height = self.zoom * self.SLIDER_WIDTH * (moment.range(pause.start, pause.end).valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px'

        return pause
      }))
    }

    function calculateContainerHeight () {
      self.containerHeight = (parseInt(self.zoom) * BASE_SIZE) * $filter('range')(self.range) + 'px'
    }

    function checkAbsence (date) {
      var d = moment(angular.copy(date))
      return _.any(self._absences, function (abs) {
        return abs.range.contains(d)
      })
    }

    function checkFerie (date) {
      return self.holidays.find(holiday => moment(holiday.date).format('L') === moment(date).format('L'));
    }

  }

  function PlanningLineDirective () {
    return {
      restrict: 'E',
      templateUrl: '/directives/planning-vertical-line/planning-vertical-line.html',
      controller: PlanningLineController,
      controllerAs: 'line',
      bindToController: {
        zoom: '=',
        dayStart: '=',
        dayEnd: '=',
        events: '=',
        pauses: '=?',
        day: '=',
        absences: '=?',
        holidays: '=?',
        clickCallback: '&',
        dropCallback: '&'
      },
      scope: true
    }
  }
})(window.angular, window._, window.moment)
