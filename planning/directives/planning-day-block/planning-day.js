;(function (angular, _) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanningDay', PlanningDayDirective)

  /**
   *
   */
  function PlanningDayController () {
    var self = this

    function init () {
    }
    init()

    _.extend(self, {})
  }

  /**
   *
   */
  function PlanningDayDirective () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'planning/directives/planning-day-block/planning-day.html',
      controller: PlanningDayController,
      controllerAs: 'dayCtrl',
      bindToController: {
        day: '=',
        events: '=',
        clickCallback: '&'
      },
      scope: true
    }
  }
})(window.angular, window._)
