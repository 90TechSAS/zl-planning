;(function (angular, moment, _) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanningWeekLine', PlanningLineDirective)

  PlanningLineController.$inject = ['$scope', 'PositionService', 'planningConfiguration']

  /**
   *
   */
  function PlanningLineController ($scope, PositionService, planningConfiguration) {
    var self = this

    var parallelText = planningConfiguration.parallelText
    var MAX_PARALLEL = planningConfiguration.MAX_PARALLEL

    function init () {
      self.displayedEvents = _(self.events).sortBy(function (event) {
        return event.continuedBefore ? -1 : (event.continuedAfter ? 0 : 1)
      }).value()
      self.lines = [[]]
      var toRemove = []
      _.each(self.displayedEvents, function (event) {
        event.style = {}
        event.depth = 1
        event.range = moment.range(event.start, event.end)
        event.style.left = calculateLeft(event)
        event.style.width = calculateWidth(event)
        event.style['background-color'] = event['background-color']
        PositionService.overlap(self.lines, event, MAX_PARALLEL, toRemove)
      })
      self.displayedEvents = _.difference(self.displayedEvents, toRemove)
      _.each(self.displayedEvents, function (event) {
        if (event.line === MAX_PARALLEL) {
          event.style.left = calculateLeft(event)
          event.style.width = calculateWidth(event)
          if (event.eventList.length > 2) {
            event.title = (event.eventList.length) + ' ' + parallelText
            event.style['background-color'] = '#000'
            event.style['color'] = '#FFF'
            event.style['font-weight'] = 'bold'
          }
          if (event.tooltip) event.tooltip = event.title
        }
        if (event.line === undefined) event.line = MAX_PARALLEL
        event.style.top = Math.round((event.line) * 100 / self.lines.length) + '%'
        event.style.height = Math.round(100 / self.lines.length) + '%'
      })
      self.lh = Math.round(100 / self.lines.length) + '%'

      self.singleDayEventsLines = [[]]
      toRemove = []
      _.each(self.oneDayEvents, function (event) {
        event.style = {}
        event.depth = 1
        event.range = moment.range(event.start, event.end)
        event.style.left = calculateLeft(event)
        event.style.width = calculateWidth(event)
        event.style['background-color'] = event['background-color']
        PositionService.overlap(self.singleDayEventsLines, event, MAX_PARALLEL, toRemove)
      })
      self.oneDayEvents = _.difference(self.oneDayEvents, toRemove)
      _.each(self.oneDayEvents, function (event) {
        if (event.line === MAX_PARALLEL) {
          event.style.left = calculateLeft(event)
          event.style.width = calculateWidth(event)
          if (event.eventList.length > 2) {
            event.style['background-color'] = '#000'
            event.style['color'] = '#FFF'
            event.style['font-weight'] = 'bold'
            event.title = (event.eventList.length) + ' ' + parallelText
          }
          if (event.tooltip) event.tooltip = event.title
        }
        if (event.line === undefined) event.line = MAX_PARALLEL
        event.style.top = Math.round((event.line) * 100 / self.singleDayEventsLines.length) + '%'
        event.style.height = Math.round(100 / self.singleDayEventsLines.length) + '%'
      })
    }

    init()

    $scope.$watchCollection(function () {
      return [self.events, self.week]
    }, init)

    function calculateWidth (event) {
      return (event.end.diff(event.start, 'days') + 1) * (100 / 7) + '%'
    }

    function calculateLeft (event) {
      return ((event.start.isoWeekday() - 1)) * (100 / 7) + '%'
    }

    function hello (event) {
      console.log(event.title)
      if (event.eventList) {
        console.log(event.eventList)
        console.log(event)
      }
    }

    _.extend(self, {
      calculateWidth: calculateWidth,
      calculateLeft: calculateLeft,
      hello: hello
    })
  }

  /**
   *
   */
  function PlanningLineDirective () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'planning/directives/planning-week-line/planning-week-line.html',
      controller: PlanningLineController,
      controllerAs: 'line',
      bindToController: {
        events: '=',
        week: '=',
        oneDayEvents: '=',
        weekEventCallback: '&'
      },
      scope: true
    }
  }
})(window.angular, window.moment, window._)
