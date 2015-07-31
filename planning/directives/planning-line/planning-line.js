(function () {

    'use strict';

    angular
        .module('90Tech.planning')
        .directive('zlPlanningLine', PlanningLineDirective);

    // TODO externalize in conf
    var SECONDS_BY_DAY = 86400,
        SLIDER_WIDTH   = 3600;

    /**
     *
     */
    function
    PlanningLineController() {

        var self = this;

        function init() {

            // Deep Copy so as not to pollute original events with ranges.
            self.events = angular.copy(self.events);

            // Pre-sort events by start Date
            self.events = _.sortBy(self.events, function (e) {
                return e.start.valueOf();
            });


            var lines = [[]];
            // First loop to populate range info.
            _.each(self.events, function (event) {
                var style                 = {};
                event.depth = 1;
                event.range               = moment.range(event.start, event.end);
                style.left                = event.start.hours() * 150 + event.start.minutes() * 150 / 60 + 'px';
                style.width               = SLIDER_WIDTH * (event.range) / SECONDS_BY_DAY / 1000 + 'px';
                style['background-color'] = event['background-color'] || '#778899';
                event.style               = style;


                line:
                    for (var i = 0; i < lines.length; i++) {

                        if (!lines[i].length) {
                            lines[i].push(event);
                            event.line = i;
                            break line;
                        }

                        if (_.filter(lines[i], function (elt) {
                                if (event.range.overlaps(elt.range)){
                                    elt.depth +=1;
                                    return true;
                                }
                            }).length) {
                            event.depth +=1;
                            if (!lines[i + 1]) {
                                lines[i + 1] = [];
                            }
                            continue line;
                        } else {
                            lines[i].push(event);
                            event.line = i;
                            break line;
                        }
                    }

            });

            _.each(self.events, function(event, i){
                event.style.top = Math.round((event.line) * 100 /lines.length) + '%';
                event.style.height = Math.round(100 / lines.length) + '%';

            });

        }

        init();
      //  console.info(self.events);
    }


    /**
     *
     */
    function PlanningLineDirective() {

        return {
            restrict        : 'E',
            templateUrl     : 'planning/directives/planning-line/planning-line.html',
            controller      : PlanningLineController,
            controllerAs    : 'line',
            bindToController: {
                events: '='
            },
            scope           : true
        };

    }

})
();
