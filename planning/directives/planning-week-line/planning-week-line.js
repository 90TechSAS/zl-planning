(function () {

  'use strict';

  angular
    .module('90Tech.planning')
    .directive('zlPlanningWeekLine', PlanningLineDirective);

  PlanningLineController.$inject = ['PositionService'];

  /**
   *
   */
  function PlanningLineController (PositionService) {
    var self = this

    function init () {
      self.displayedEvents = _(self.events).sortBy(function (event) {
        return event.continuedBefore ? -1 : (event.continuedAfter ? 0 : 1)
      }).value()
      self.lines = [[]];
      _.each(self.displayedEvents, function(event){
        event.style = {}
        event.depth = 1
        event.range = moment.range(event.start, event.end)
        event.style.left = calculateLeft(event)
        event.style.width = calculateWidth(event)
        PositionService.overlap(self.lines, event)
      })
      _.each(self.displayedEvents, function(event){
        event.style.top = Math.round((event.line) * 100 / self.lines.length) + '%';
        event.style.height = Math.round(100 / self.lines.length) + '%';
      })
      self.lh = Math.round(100 / self.lines.length) + '%';

      self.singleDayEventsLines = [[]]

      _.each(self.oneDayEvents, function(event) {
        event.style = {}
        event.depth = 1
        event.range = moment.range(event.start, event.end)
        event.style.left = calculateLeft(event)
        event.style.width = calculateWidth(event)
        PositionService.overlap(self.singleDayEventsLines, event)
      })

      _.each(self.oneDayEvents, function (event) {
        event.style.top = Math.round((event.line) * 100 / self.singleDayEventsLines.length) + '%'
        event.style.height = Math.round(100 / self.singleDayEventsLines.length) + '%'
      })
    }

    init()

    function calculateWidth (event)
      console.log(100/7);
      return (event.end.diff(event.start, 'days') + 1) * (100 / 7) + '%'
    }

    function calculateLeft (event) {
      console.log(100/7);
      return ((event.start.date() - 1) % 7) * (100 / 7) + '%'
    }

    _.extend(self, {
      calculateWidth: calculateWidth,
      calculateLeft: calculateLeft
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
        oneDayEvents: '='
      },
      scope: true
    };

  }

})
();
