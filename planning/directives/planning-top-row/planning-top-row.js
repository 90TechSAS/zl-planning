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

            function init(){
                _.times(24, function(i){
                    var d = moment(self.position);
                    d.hour(i);
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