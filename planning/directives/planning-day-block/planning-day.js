;(function (angular, _, moment) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanningDay', PlanningDayDirective)

  PlanningDayController.$inject = [
    // Angular
    '$scope'
    // Libs
    // Managers
    // Services
    // Const
    // Resolved
  ]
  function PlanningDayController (
    // Angular
    $scope
    // Libs
    // Managers
    // Services
    // Const
    // Resolved
  ) {
    var self = this

    self.$onInit = function () {
      _.extend(self, {
        dropEvent: dropEvent,
        absents: []
      })

      self.isDefined = (self.day.events === undefined)
      init()
      $scope.$watchCollection([self.day, self.absences], function () {
        if (self.day && self.day.date && self.absences && Object.keys(self.absences).length) {
          self.absents = Object.keys(self.absences).reduce(function (acc, key) {
            var array = self.absences[key]
            var hasOverlap = _.any(array, function (absence) {
              var range = moment.range(absence.start, absence.end)
              return self.day.date.within(range)
            })
            if (hasOverlap) {
              acc.push(key)
            }
            return acc
          }, [])
          self.absentsString = '<div>' + self.absents.join('<br>') + '</div>'
        } else {
          self.absentsString = ''
          self.absents = []
        }
      })
    }


    function init () {
    }


    function dropEvent (data, event) {
      self.dropCallback({ $data: data, $event: event})
    }
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
        dropCallback: '&',
        absences: '=?'
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
})(window.angular, window._, window.moment)
