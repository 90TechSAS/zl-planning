(function () {

    'use strict';

    angular
        .module('90Tech.planning')
        .directive('zlPlanning', PlanningDirective);


    function PlanningDirective() {

        var sortedEvents;

        return {
            restrict        : 'E',
            templateUrl     : 'planning/directives/planning/planning.html',
            controller      : PlanningController,
            controllerAs    : 'planning',
            bindToController: {
                events  : '=',
                entities: '=',
                position: '=',
                mode    : '=',
                dayStart: '=',
                dayEnd  : '=',
                callback: '&'
            },
            scope           : {}
        };

        function PlanningController() {
            var self = this;

            function split(event) {
                if (event.start.dayOfYear() === event.end.dayOfYear()) {
                    return [event];
                }
                var first_event = angular.copy(event);
                first_event.end = moment(event.start).hour(23).minute(59).second(59);

                var second_event   = angular.copy(event);
                second_event.start = moment(first_event.end).add(1, 's');

                return [first_event].concat(split(second_event));


            }

            function filter(events) {
                return _.filter(events, function (e) {
                    if (self.mode === 'week') {
                        var startWeek = moment(self.position).weekday(0).hour(0).minute(0).second(0).subtract(1, 'second');
                        var endWeek   = moment(self.position).weekday(7).hour(0).minute(0).second(1);
                        return e.start.isBetween(startWeek, endWeek);
                    }

                });
            }

            function init() {
                self.events  = (_.flatten(_.map(self.events, split)));
                self.events  = filter(self.events);
                console.info(self.events);
                sortedEvents = _.groupBy(self.events, function (e) {
                    return e.start.dayOfYear();
                });
                console.info(sortedEvents);

            }

            init();


            function isToday(n) {
                return self.position.week() === moment().week() && n === moment().weekday();
            }

            function currentTimeToPixels() {
                var totalMinutes = moment().hour() * 60 + moment().minutes();
                return Math.floor((150 * totalMinutes) / 60);
            }

            function isCurrentWeek() {
                return self.position.week() === moment().week();
            }


            _.extend(self, {
                sortedEvents       : sortedEvents,
                isToday            : isToday,
                currentTimeToPixels: currentTimeToPixels,
                isCurrentWeek      : isCurrentWeek
            })
        }

    }

})();
