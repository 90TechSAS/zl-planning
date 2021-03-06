;(function (angular, moment, _) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanningWeekLine', PlanningLineDirective)

  PlanningLineController.$inject = ['$scope', 'PositionService', 'planningConfiguration', 'ColorService']

  /**
   *
   */
  function PlanningLineController ($scope, PositionService, planningConfiguration, ColorService) {
    var self = this

    self.$onInit = function () {
      _.extend(self, {
        calculateWidth: calculateWidth,
        calculateLeft: calculateLeft
      })

      init()

      $scope.$watchCollection(function () {
        return [self.events, self.week]
      }, init)

    }

    var parallelText = planningConfiguration.parallelText
    var MAX_PARALLEL = planningConfiguration.MAX_PARALLEL

    function init () {
      self.displayedEvents = _(self.events).sortBy(function (event) {
        return event.continuedBefore ? -1 : (event.continuedAfter ? 0 : 1) // Order event list
      }).value()

      self.displayedEvents = positioning(self.displayedEvents)
      self.oneDayEvents = positioning(self.oneDayEvents)
    }



    function positioning (eventList) {
      var lines = [[]]
      var toRemove = []
      _.each(eventList, function (event) {
        event.style = {}
        event.depth = 1
        event.range = moment.range(event.start, event.end)
        PositionService.overlap(lines, event, MAX_PARALLEL, toRemove, true)
      })
      eventList = _.difference(eventList, toRemove)
      _.each(eventList, function (event) {
        setStyle(event, lines.length)
      })
      return eventList
    }

    function setStyle (event, height) {
      event.style.left = calculateLeft(event)
      event.style.width = calculateWidth(event)
      event.style['background-color'] = event['background-color']
      if (ColorService.getLuminance(event.style['background-color'])> 200){
        event.style.color = 'black'
      } else{
        event.style.color = 'white'
      }

      event.style.top = Math.ceil((event.line) * 100 / height) + '%'
      event.style.height = Math.round(100 / height) + '%'
      if (event.line === undefined) event.line = MAX_PARALLEL
      if (event.eventList && event.eventList.length > 1) {
        event.style['background-color'] = '#000'
        event.style['color'] = '#FFF'
        event.style['font-weight'] = 'bold'
        event.title = (event.eventList.length) + ' ' + parallelText
        if (event.tooltip) event.tooltip = event.title
      }
    }


    function calculateWidth (event) {
      if (event.start.day() === event.end.day()) {
        return (event.end.diff(event.start, 'days') + 1) * (100 / 7) + '%'
      } else {
        var diff = Math.ceil(event.end.diff(event.start, 'hours') / 24)
        if (event.end.hours() < event.start.hours()) {
          diff += 1
        }
        return (diff * (100 / 7)) + '%'
      }
    }

    function calculateLeft (event) {
      return ((event.start.isoWeekday() - 1)) * (99.9 / 7) + '%'
    }


  }

  function PlanningLineDirective () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/directives/planning-week-line/planning-week-line.html',
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
