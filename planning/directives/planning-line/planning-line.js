;(function (angular, _, moment) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanningLine', PlanningLineDirective)

  PlanningLineController.$inject = ['$scope', 'planningConfiguration', 'PositionService', 'ColorService']

  /**
   *
   */
  function
  PlanningLineController ($scope, planningConfiguration, PositionService, ColorService) {

    var BASE_SIZE = planningConfiguration.BASE_SIZE
    var parallelText = planningConfiguration.parallelText
    var MAX_PARALLEL = planningConfiguration.MAX_PARALLEL

    var self = this

    self.$onInit = function () {
      _.extend(self, {
        clickEvent: clickEvent,
        calcWidth: calcWidth,
        dropEvent: dropEvent
      })
      init()



      $scope.$watchCollection(function () {
        return [self.events, self.dayStart, self.dayEnd]
      }, init)
    }

    self.log = function (a) {
    }

    self.replace = function (string) {
      if (!string) return
      return string.replace(/([a-zA-Z\ ])\w+/, '')
    }

    self.preEvent = {}

    function extractMinutesFromEvent($event){
      var minutes
      if (_.contains($event.target.classList, 'half-hour')) {
        // If the user has clicked right on the half-hour line, offsetX is 0
        minutes = 30
      } else {
        minutes = Math.floor($event.offsetX / (BASE_SIZE * self.zoom) * 60)
      }
      return minutes
    }

    function dropEvent (data, event) {
      var hour = parseInt(event.target.getAttribute('hour'))
      var minutes = extractMinutesFromEvent(event)
      self.dropCallback({ $data: data, $event: event, $hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
    }

    function clickEvent (hour, $event) {
      var minutes = extractMinutesFromEvent($event)
      self.clickCallback({$hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
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
          event.style.color = '#fff'
          event.title = (event.eventList.length) + ' ' + parallelText
          if (event.tooltip) event.tooltip = event.title
        }
        event.style.width = self.zoom * self.SLIDER_WIDTH * (event.range.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px'
        if (event.line === undefined) event.line = MAX_PARALLEL
        event.style.top = Math.round((parseInt(event.line)) * 70 / lines.length) + '%'
        event.style.height = Math.round(70 / lines.length) + '%'
        event.percentage = '100%'
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
              left: (((moment(s).hours() - self.dayStart.h) * BASE_SIZE * self.zoom + (moment(s).minutes()) * BASE_SIZE * self.zoom / 60) + 2) +  'px',
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
        currentId++
      })
      if (self.pauses) {
        createBreaks()
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

        pause.style.left = (pause.start.hours() - self.dayStart.h) * BASE_SIZE * self.zoom + pause.start.minutes() * BASE_SIZE * self.zoom / 60 + 'px'
        pause.style.width = self.zoom * self.SLIDER_WIDTH * (moment.range(pause.start, pause.end).valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px'

        return pause
      }))
    }
  }

  function PlanningLineDirective () {
    return {
      restrict: 'E',
      templateUrl: 'planning/directives/planning-line/planning-line.html',
      controller: PlanningLineController,
      controllerAs: 'line',
      bindToController: {
        zoom: '=',
        dayStart: '=',
        dayEnd: '=',
        events: '=',
        clickCallback: '&',
        dropCallback: '&',
        pauses: '=?'
      },
      scope: true
    }
  }
})(window.angular, window._, window.moment)
