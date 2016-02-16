(function () {

  'use strict';

  angular
    .module('90Tech.planning')
    .directive('zlPlanningWeekLine', PlanningLineDirective);

  PlanningLineController.$inject = [];

  /**
   *
   */
  function PlanningLineController () {
    var self = this

    function init () {
      console.info(self.oneDayEvents)

      self.displayedEvents = _(self.events).sortBy(function (event) {
        return event.continuedBefore ? -1 : (event.continuedAfter ? 0 : 1)
      }).value()

      self.height = Math.floor(100 / self.displayedEvents.length) + '%'

    }

    init()

    function calculateWidth (event) {
      if (event.end.diff(event.start, 'days') + 1 > 7) {
        console.info(event)
        console.info(event.end.diff(event.start, 'days') + 1)
      }
      return (event.end.diff(event.start, 'days') + 1) * 14.28 + '%'
    }

    function calculateLeft (event) {
      return ((event.start.date() - 1) % 7 ) * 14.28 + '%'

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
