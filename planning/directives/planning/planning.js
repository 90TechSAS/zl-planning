(function () {

    'use strict';

    angular
        .module('90Tech.planning')
        .directive('zlPlanning', PlanningDirective);

    PlanningController.$inject = ['$scope'];


    function PlanningController($scope) {

        var self = this;

        function split(event) {
            // Event starts and ends the same day
            var start = moment(event.start).hour(self._dayStart.h).minute(self._dayStart.m).second(0);
            var stop  = moment(event.end).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59);
            if (event.start.dayOfYear() === event.end.dayOfYear()) {
                // reset the boundaries if they exceed the one fixed.
                // And trim events that are entirely out of the boundaries
                if (event.start.isBefore(start)) {
                    if (event.end.isBefore(start)) {
                        return [];
                    }
                    event.start = start;
                }
                if (event.end.isAfter(stop)) {
                    if (event.start.isAfter(stop)) {
                        return [];
                    }
                    event.end = stop;
                }
                return [event];
            }
            // Event is on several days.
            // Build a first event that ends at the end of the first day
            var first_event = angular.copy(event);
            first_event.end = moment(event.start).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59);
            if (event.start.isBefore(start)) {
                first_event.start = start;
            }

            var startNextDay = moment(event.start).add(1, 'day').hour(self._dayStart.h).minute(self._dayStart.m);
            var endThisDay   = moment(event.start).hour(self._dayEnd.h).minute(self._dayEnd.m);
            if (event.end.isBefore(startNextDay)) {
                if (first_event.start.isAfter(endThisDay)) {
                    return [];
                }
                // Event finishes before start hour next day. No need to create another one
                return [first_event];
            }
            first_event.continuedAfter = true;


            //Build a second event that starts at the beginning of the following days.
            // This event may end several days later. Recursion will handle it
            var second_event             = angular.copy(event);
            second_event.start           = moment(event.start).add(1, 'day').hour(self._dayStart.h).minute(self._dayStart.m);
            second_event.continuedBefore = true;

            if (event.start.isAfter(endThisDay)) {
                // If the first event starts after curfew, don't add it
                return split(second_event);
            }

            return [first_event].concat(split(second_event));
        }

        function filter(events) {
            return _.filter(events, function (e) {
                var start, stop;
                if (self.mode === 'week') {
                    start = moment(self.position).weekday(0).hour(self._dayStart.h).minute(self._dayStart.m).second(0);
                    stop  = moment(self.position).weekday(7).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59);
                } else if (self.mode === 'day') {
                    start = moment(self.position).hour(self._dayStart.h).minute(self._dayStart.m).second(0);
                    stop  = moment(self.position).hour(self._dayEnd.h).minute(self._dayEnd.m).second(59);
                }
                return e.start.isBetween(start, stop);
            });
        }

        function addMissingDays(sortedEvents) {
            sortedEvents    = sortedEvents || {};
            var startingDay = moment(self.position).weekday(0).dayOfYear();
            _.times(7, function (i) {
                if (!sortedEvents[startingDay + i]) {
                    sortedEvents[startingDay + i] = [];
                }
            });
        }

        function addMissingEntities(sortedEvents){
            sortedEvents = sortedEvents || {};
            _.each(self.entities, function(e){
                if (!sortedEvents[e]){
                    sortedEvents[e] = [];
                }
            })
        }

        function parseTime(h) {
            return {h: h.split(':')[0], m: h.split(':')[1]};
        }

        function init() {

            self._dayStart    = self.dayStart ? parseTime(self.dayStart) : parseTime('00:00');
            self._dayEnd      = self.dayEnd ? parseTime(self.dayEnd) : parseTime('23:59');
            self.sortedEvents = undefined;
            self._events      = (_.flatten(_.map(self.events, split)));
            self._events      = filter(self._events);
            if (self.mode === 'week') {

                self.sortedEvents = _.groupBy(self._events, function (e) {
                    return e.start.dayOfYear();
                });

                addMissingDays(self.sortedEvents);
            } else if (self.mode === 'day') {
                self.sortedEvents = _.groupBy(self._events, function (e) {
                    return e[self.dayField];
                });
                addMissingEntities(self.sortedEvents);
            }
        }


        $scope.$watchCollection(function () {
            return [self.events, self.entities, self.position, self.mode, self.dayStart, self.dayEnd];
        }, init);


        function isToday(n) {
            return self.position.week() === moment().week() && n == moment().dayOfYear();
        }

        function currentTimeToPixels() {
            var totalMinutes = moment().hour() * 60 + moment().minutes();
            return Math.floor((150 * totalMinutes) / 60);
        }

        function isCurrent() {
            return self.position.isSame(moment(), self.mode);
        }

        function clickCallbackWrapper(h, m, d) {
            self.clickCallback({$moment: moment().hour(h).minute(m).second(0).dayOfYear(d)});
        }


        _.extend(self, {
            //  sortedEvents       : sortedEvents,
            isToday             : isToday,
            currentTimeToPixels : currentTimeToPixels,
            isCurrent           : isCurrent,
            clickCallbackWrapper: clickCallbackWrapper
        })
    }


    function PlanningDirective() {


        return {
            restrict        : 'E',
            templateUrl     : 'planning/directives/planning/planning.html',
            controller      : PlanningController,
            controllerAs    : 'planning',
            bindToController: {
                events       : '=',
                entities     : '=',
                position     : '=',
                mode         : '=',
                dayStart     : '=',
                dayEnd       : '=',
                dayField     : '=',
                eventCallback: '&',
                dayCallback  : '&',
                clickCallback: '&'

            },
            scope           : {}
        };

    }

})();
