(function () {

    'use strict';

    angular
        .module('90Tech.planning')
        .directive('zlPlanningLeftColumn', PlanningDirective);


    function PlanningDirective() {

        return {
            restrict        : 'E',
            templateUrl     : 'planning/directives/planning-left-column/planning-left-column.html',
            controller      : PlanningLeftColumnController,
            controllerAs    : 'planningLeftColumn',
            bindToController: {
                events  : '=',
                entities: '=',
                position: '=',
                mode    : '=',
                callback: '&'
            },
            scope           : true
        };

        function PlanningLeftColumnController() {

            var self = this;
            var days = [];

            function init(){
                _.times(7, function(i){
                   var d = moment(self.position);
                    d.weekday(i);
                    days.push(d);
                });
            }

            _.extend(self, {
               days: days
            });

            init();


        }
    }


})();
