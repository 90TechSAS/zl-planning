;(function (angular, moment, _) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanningLeftColumn', PlanningDirective)

  PlanningLeftColumnController.$inject = ['$scope']

  function PlanningLeftColumnController ($scope) {
    var self = this

    self.$onInit = function () {
      $scope.$watchCollection(function () {
        return [self.events, self.position, self.mode, self.dayStart, self.dayEnd, self.usableDays]
      }, init)
    }

    function init () {
      self.days = []
      self.allowedDays = self.usableDays
      if (self.mode === 'week') {
        _.forEach(self.allowedDays, function (d) {
          var day = moment(self.position)
          day.weekday(d)
          self.days.push(day)
        })
        self.days = _.sortBy(self.days, function (d) {
          return moment(d).toDate()
        })
      } else if (self.mode === 'day' && self.dayField) {
        self.column = Object.keys(self.events).sort()
      }
    }


  }

  function PlanningDirective () {
    return {
      restrict: 'E',
      templateUrl: 'planning/directives/planning-left-column/planning-left-column.html',
      controller: PlanningLeftColumnController,
      controllerAs: 'planningLeftColumn',
      bindToController: {
        events: '=',
        position: '=',
        mode: '=',
        dayField: '=',
        usableDays: '='
      },
      scope: true
    }
  }
})(window.angular, window.moment, window._)
