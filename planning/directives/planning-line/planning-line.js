(function(){

    'use strict';

    angular
        .module('90Tech.planning')
        .directive('zlPlanningLine', PlanningLineDirective);

    PlanningLineController.$inject = ['$scope', 'planningConfiguration'];


    /**
     *
     */
    function
    PlanningLineController($scope, planningConfiguration){

        var BASE_SIZE = planningConfiguration.BASE_SIZE;


        var self            = this;


        function clickEvent(hour, $event){
            if (_.contains($event.target.classList, 'half-hour')){
                // If the user has clicked right on the half-hour line, offsetX is 0
                var minutes = 30;
            } else{
                var minutes = Math.floor($event.offsetX / (BASE_SIZE * self.zoom) * 60);
            }
            self.clickCallback({$hour: hour + parseInt(self.dayStart.h), $minutes: minutes});
        }

        function init(){
            //     self.SLIDER_WIDTH   = 24 * BASE_SIZE;

            self._events = angular.copy(self.events);

            self.range          = self.dayEnd.h - self.dayStart.h;
            self.SECONDS_BY_DAY = 3600 * self.range;
            self.SLIDER_WIDTH   = BASE_SIZE * self.range;


            // Pre-sort events by start Date
            self._events = _.sortBy(self._events, function(e){
                return e.start.valueOf();
            });


            var lines = [[]];
            _.each(self._events, function(event){
                var style   = {};
                event.depth = 1;
                event.range = moment.range(event.start, event.end);
                style.left  = (event.start.hours() - self.dayStart.h) * BASE_SIZE * self.zoom + event.start.minutes() * BASE_SIZE * self.zoom / 60 + 'px';
                //   style.left                = event.start.hours() * 150 + event.start.minutes() * 150 / 60 + 'px';
                style.width               = self.zoom * self.SLIDER_WIDTH * (event.range) / self.SECONDS_BY_DAY / 1000 + 'px';
                style['background-color'] = event['background-color'] || '#778899';
                event.style               = style;


                line:
                    for (var i = 0; i < lines.length; i++){

                        if (!lines[i].length){
                            lines[i].push(event);
                            event.line = i;
                            break line;
                        }

                        if (_.filter(lines[i], function(elt){
                                if (event.range.overlaps(elt.range)){
                                    elt.depth += 1;
                                    return true;
                                }
                            }).length){
                            event.depth += 1;
                            if (!lines[i + 1]){
                                lines[i + 1] = [];
                            }
                            continue line;
                        } else{
                            lines[i].push(event);
                            event.line = i;
                            break line;
                        }
                    }

            });

            _.each(self._events, function(event, i){
                event.style.top    = Math.round((event.line) * 100 / lines.length) + '%';
                event.style.height = Math.round(100 / lines.length) + '%';

            });

        }

        init();


        function calcWidth(zoom){
            return (parseInt(zoom) * BASE_SIZE) + 'px';
        }


        $scope.$watchCollection(function(){
            return [self.events, self.dayStart, self.dayEnd];
        }, init);

        _.extend(self, {
            clickEvent: clickEvent,
            calcWidth : calcWidth
        });
    }


    /**
     *
     */
    function PlanningLineDirective(){

        return {
            restrict        : 'E',
            templateUrl     : 'planning/directives/planning-line/planning-line.html',
            controller      : PlanningLineController,
            controllerAs    : 'line',
            bindToController: {
                zoom         : '=',
                dayStart     : '=',
                dayEnd       : '=',
                events       : '=',
                clickCallback: '&'
            },
            scope           : true
        };

    }

})
();
