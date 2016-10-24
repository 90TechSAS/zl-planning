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

    self.isDefined = (self.day.events === undefined)
    function init () {
    }

    init()

    function dropEvent (data, event) {
      self.dropCallback({ $data: data, $event: event})
    }

    _.extend(self, {
      dropEvent: dropEvent
    })
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
        clickCallback: '&',
        dropCallback: '&'
      },
      scope: true,
      link: function (scope, element) {
        var el = element[0]
        window.addEventListener('dragover', function (e) {
          e.preventDefault();
        }, false);
        window.addEventListener('drop', function (e) {
          e.preventDefault();
        }, false);
        el.addEventListener(
          'drop',
          function (e) {
            e.preventDefault()
            e.stopPropagation()
            if (e.stopPropagation) e.stopPropagation()
            this.classList.remove('over')
            scope.$apply(function () {
              scope.dayCtrl.dropEvent(JSON.parse(e.dataTransfer.getData('Text')), e)
            })
            return false
          },
          false
        )

        el.addEventListener(
          'dragenter',
          function (e) {
            this.classList.add('over')
            return false
          },
          false
        )

        el.addEventListener(
          'dragleave',
          function (e) {
            this.classList.remove('over')
            return false
          },
          false
        )
      }
    }
  }
})(window.angular, window._)
