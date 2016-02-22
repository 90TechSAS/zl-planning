(function () {

    'use strict';

    angular
        .module('90Tech.planning')
        .directive('zlPlanningLeftColumn', PlanningDirective);

    PlanningLeftColumnController.$inject = ['$scope'];

    function PlanningLeftColumnController($scope) {

        var self = this;

        function init() {
            self.days = [];
            if (self.mode === 'week') {

                _.times(7, function (i) {
                    var d = moment(self.position);
                    d.weekday(i);
                    self.days.push(d);
                });
            } else if (self.mode === 'day' && self.dayField) {
                self.column = Object.keys(self.events).sort();
            }
        }

        $scope.$watchCollection(function () {
            return [self.events, self.position, self.mode, self.dayStart, self.dayEnd];
        }, init);
    }

    function PlanningDirective() {

        return {
            restrict        : 'E',
            templateUrl     : 'planning/directives/planning-left-column/planning-left-column.html',
            controller      : PlanningLeftColumnController,
            controllerAs    : 'planningLeftColumn',
            bindToController: {
                events  : '=',
                position: '=',
                mode    : '=',
                dayField: '='
            },
            scope           : true
        };

    }


})();
