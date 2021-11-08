;(function (angular, moment, _) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanningTopRow', topRowDirective)

  topRowDirective.$inject = ['planningConfiguration']

  function topRowDirective (planningConfiguration) {
    var BASE_SIZE = planningConfiguration.BASE_SIZE

    return {
      restrict: 'E',
      templateUrl: '/directives/planning-top-row/planning-top-row.html',
      controller: ['$scope', PlanningTopRowController],
      controllerAs: 'planningTopRow',
      bindToController: {
        zoom: '=',
        dayStart: '=',
        dayEnd: '=',
        events: '=',
        entities: '=',
        position: '=',
        mode: '=',
        callback: '&',
        holidays: '='
      },
      scope: {}
    }

    function PlanningTopRowController ($scope) {
      var self = this

      self.$onInit = function () {
        $scope.$watchGroup([function () { return self.dayStart }, function () { return self.dayEnd }], init)

        _.extend(self, {
          calcWidth: calcWidth,
          calcMargin: calcMargin
        })

        init()
      }

      function init () {
        var range = self.dayEnd.h - self.dayStart.h + 1
        self.hours = []
        _.times(range, function (i) {
          var d = moment(self.position)
          d.hour(i + parseInt(self.dayStart.h))
          d.minute(0)
          self.hours.push(d)
        })
      }



      function calcWidth (zoom) {
        return (parseInt(zoom) * BASE_SIZE) + 'px'
      }

      function calcMargin (zoom, index) {
        var half = (parseInt(zoom) * (BASE_SIZE / 2))
        if (!index) half = half - (3 * parseInt(zoom))
        return '0 ' + half + 'px 0 -' + half + 'px'
      }

    }
  }
})(window.angular, window.moment, window._)
