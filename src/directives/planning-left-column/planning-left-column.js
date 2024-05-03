;(function (angular, moment, _) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanningLeftColumn', PlanningDirective)

  PlanningLeftColumnController.$inject = ['$scope', 'HolidaysServicePlanning']

  function PlanningLeftColumnController ($scope, HolidaysServicePlanning) {
    var self = this

    self.$onInit = function () {
      _.extend(self, {
        triggerDayEvent,
        isSolidarityDay
      })
      $scope.$watchCollection(function () {
        return [self.events, self.position, self.mode, self.dayStart, self.dayEnd, self.usableDays, self.entitiesName]
      }, init)
    }

    function init () {
      if (!self.threeDays) self.activateDuplicationButtons = true
      self.days = []
      self.allowedDays = self.usableDays
      self._absences = []
      if (self.mode === 'week') {
        _.forEach(self.allowedDays, function (d) {
          var day = moment(self.position)
          day.weekday(d)
          self.days.push(day)
        })
        self.days = _.sortBy(self.days, function (d) {
          return moment(d).toDate()
        })
        if(self.absences) {
          let index = 0
          self.days.forEach(day => {
            self._absences[index]=[]
            for (const [key, value] of Object.entries(self.absences)) {
              value.forEach(absence => {
                if(day.isBetween(moment(absence.start), moment(absence.end)) || (moment(day).isSame(moment(absence.start),'day') && moment(day).isSame(moment(absence.end),'day'))){
                  self._absences[index].push(angular.copy(absence))
                }
              })
            }
            index++
          });
        }
      } else if (self.mode === 'day' && self.dayField) {
        self.column = self.entitiesName
      }
    }

    function triggerDayEvent (line, move) {
      if (move) {
        return self.dayEvent(angular.copy(self.events[line._id]), true)
      } else {
        return self.dayEvent(angular.copy(self.events[line._id]))
      }
    }

    function isSolidarityDay(day){
      return HolidaysServicePlanning.isSolidarityDay(day.endOf('day'))
    }

  }

  function PlanningDirective () {
    return {
      restrict: 'E',
      templateUrl: '/directives/planning-left-column/planning-left-column.html',
      controller: PlanningLeftColumnController,
      controllerAs: 'planningLeftColumn',
      bindToController: {
        events: '=',
        entitiesName: '=',
        position: '=',
        mode: '=',
        dayField: '=',
        usableDays: '=',
        isFerie: '=?',
        absences: '=',
        dayEvent: '=',
        threeDays: '<'
      },
      scope: true
    }
  }
})(window.angular, window.moment, window._)
