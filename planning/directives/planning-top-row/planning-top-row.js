(function(){
    'use strict';


    angular
        .module('90Tech.planning')
        .directive('zlPlanningTopRow', topRowDirective);

    function topRowDirective(){

        return {
            restrict        : 'E',
            templateUrl     : 'planning/directives/planning-top-row/planning-top-row.html',
            controller      : PlanningTopRowController,
            controllerAs    : 'planningTopRow',
            bindToController: {
                dayStart: '=',
                dayEnd  : '=',
                events  : '=',
                entities: '=',
                position: '=',
                mode    : '=',
                callback: '&'
            },
            scope           : {}
        };

        function PlanningTopRowController(){
            var self = this;
            var hours = [];
            var range = self.dayEnd.h - self.dayStart.h + 1;

            function init(){
                _.times(range, function(i){
                    var d = moment(self.position);
                    d.hour(i+ parseInt(self.dayStart.h));
                    d.minute(0);
                    hours.push(d);
                });
            }


            _.extend(self, {
                hours: hours
            });

            init();
        }


    }


})();