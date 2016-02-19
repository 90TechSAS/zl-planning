angular.module('90Tech.planning').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('planning/directives/planning-left-column/planning-left-column.html',
    "<div class=\"left-column\" ng-switch=\"planningLeftColumn.mode\">\n" +
    "    <div class=\"planning-head\"></div>\n" +
    "    <div class=\"left-body\">\n" +
    "    <div class=\"planning-2pc\"></div>\n" +
    "        <div class=\"days-body\" ng-switch-when=\"week\">\n" +
    "            <div class=\"dayName row8 b-b animate\"\n" +
    "                 ng-repeat=\"day in planningLeftColumn.days\"\n" +
    "                    ng-class=\"{today: planning.isToday(day.dayOfYear())}\"\n" +
    "                    ng-click=\"planning.dayCallback({$day:day})\">\n" +
    "                <h4>\n" +
    "                    {{day | format:'dddd' | capitalize}}<br>\n" +
    "                    <small>{{day | format:'ll'}}</small>\n" +
    "                </h4>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"days-body\" ng-switch-when=\"day\">\n" +
    "            <div class=\"dayName row8 b-b animate\"\n" +
    "                 ng-repeat=\"col in planningLeftColumn.column\">\n" +
    "                <h4>\n" +
    "                    {{col}}\n" +
    "                </h4>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div style=\"height:10px\"><!-- compensate for scrollbar --></div>\n" +
    "</div>"
  );


  $templateCache.put('planning/directives/planning-line/planning-line.html',
    "<div class=\"b-b b-r all-day day-hour\"\n" +
    "     ng-style=\"{width: line.calcWidth(line.zoom)}\"\n" +
    "     ng-repeat=\"n in [] | range:line.range\"\n" +
    "     ng-dblclick=\"line.clickEvent(n, $event)\">\n" +
    "    <span class=\"half-hour\"></span>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"event\"\n" +
    "     ng-repeat=\"event in line._events\"\n" +
    "     ng-style=\"event.style\"\n" +
    "     ng-class=\"{'continued-before': event.continuedBefore, 'continued-after': event.continuedAfter}\"\n" +
    "     ng-click=\"planning.eventCallback({'event':event})\"\n" +
    "     tooltip-append-to-body=\"true\"\n" +
    "     uib-tooltip=\"{{event.tooltip}}\">\n" +
    "    <!--<span class=\"calendar-urgency bg-pink\"></span>-->\n" +
    "\n" +
    "    <div class=\"event-line-container\" style=\"\">\n" +
    "        <div class=\"event-line\" ng-style=\"{'background-color': event.color}\" ng-if=\"!event.continuedBefore\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"title-container\"><span>{{event.title}}</span></div>\n" +
    "</div>"
  );


  $templateCache.put('planning/directives/planning-top-row/planning-top-row.html',
    "<div class=\"planning-top-row\">\n" +
    "    <div ng-repeat=\"hour in planningTopRow.hours\" class=\"day-hour\"\n" +
    "         ng-style=\"{width: planningTopRow.calcWidth(planningTopRow.zoom), margin: planningTopRow.calcMargin(planningTopRow.zoom, $index)}\">\n" +
    "        <h4>{{hour | format:'HH:mm'}}</h4>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('planning/directives/planning/planning.html',
    "<zl-planning-left-column mode=\"planning.mode\" position=\"planning.position\" day-field=\"planning.dayField\"\n" +
    "                         events=\"planning.sortedEvents\"></zl-planning-left-column>\n" +
    "<div class=\"\" style=\"height:100%\">\n" +
    "    <div zl-horizontal-scroll scroll-left=\"planning.currentTimeToPixels()\" style=\"height:100%\">\n" +
    "        <div ng-style=\"{width: planning.width}\" class=\"planning-body\">\n" +
    "            <zl-planning-top-row mode=\"planning.mode\" zoom=\"planning.zoom\" position=\"planning.position\"\n" +
    "                                 day-start=\"planning._dayStart\" day-end=\"planning._dayEnd\"></zl-planning-top-row>\n" +
    "            <div class=\"hour-cursor\" ng-style=\"{left: planning.currentTimeToPixels()+'px'}\"\n" +
    "                 ng-if=\"planning.isCurrent() && planning.isInDayRange()\">\n" +
    "                <div class=\"hour-caret\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"planning-2pc\"></div>\n" +
    "            <div ng-if=\"!planning.events.length\" style=\"position:fixed;left:50%;margin:auto\">{{'nothing_to_show' |\n" +
    "                strPlanning}}\n" +
    "            </div>\n" +
    "            <zl-planning-line\n" +
    "                    zoom=\"planning.zoom\"\n" +
    "                    day-start=\"planning._dayStart\" day-end=\"planning._dayEnd\"\n" +
    "                    ng-repeat=\"i in planning.keys(planning.sortedEvents)\" class=\"day b-b\"\n" +
    "                    ng-class=\"{today: planning.isToday(i)}\" events=\"planning.getEvents(i)\"\n" +
    "                    click-callback=\"planning.clickCallbackWrapper($hour, $minutes, i)\"></zl-planning-line>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
