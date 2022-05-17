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
        getName,
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
              if (moment(absence.start).diff(absence.end, 'minutes') === 0) {
                return false
              }
              if (moment(absence.start).hours() === 12 && moment(absence.start).isSame(self.day.date, 'day') ) {
                return !!moment(absence.start).isBetween(self.day.date, moment(self.day.date).endOf('day'))
              }
              if (self.day.date.within(range) ) {
                return true
              }
            })
            if (hasOverlap) {
              acc.push(key)
            }
            return acc
          }, [])
          self.absentsString = '<div>' + self.getName(self.absents).join('<br>') + '</div>'
        } else {
          self.absentsString = ''
          self.absents = []
        }
      })
    }


    function init () {
      if(self.holidays && self.day.date) {
        self.isFerie = self.holidays.find(holiday => moment(holiday.date).format('L') === moment(self.day.date).format('L'));
      }
    }


    function dropEvent (data, event) {
      self.dropCallback({ $data: data, $event: event})
    }

    function getName(ids) {
      const array = []
      ids.forEach((id) => {
        array.push(self.entities.find((el) => el._id === id).fullname)
      })
      return array
    }
  }

  /**
   *
   */
  function PlanningDayDirective () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/directives/planning-day-block/planning-day.html',
      controller: PlanningDayController,
      controllerAs: 'dayCtrl',
      bindToController: {
        day: '=',
        events: '=',
        clickCallback: '&',
        entities: '=?',
        dropCallback: '&',
        absences: '=?',
        holidays: "="
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
