angular.module('90Tech.planning').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('planning/directives/planning-day-block/planning-day.html',
    "<div class=\"day-block\">\n" +
    "    <div class=\"day-number\">{{ dayCtrl.day.date.date() }}</div>\n" +
    "    <div class=\"events-container\">\n" +
    "\n" +
    "        <div ng-style=\"{'background-color': event.color}\" class=\"month-event\"\n" +
    "             ng-repeat=\"event in dayCtrl.day.events |limitTo:5\">{{event.title}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('planning/directives/planning-left-column/planning-left-column.html',
    "<div class=\"left-column\" ng-switch=\"planningLeftColumn.mode\">\r" +
    "\n" +
    "    <div class=\"planning-head\"></div>\r" +
    "\n" +
    "    <div class=\"left-body\">\r" +
    "\n" +
    "    <div class=\"planning-2pc\"></div>\r" +
    "\n" +
    "        <div class=\"days-body\" ng-switch-when=\"week\">\r" +
    "\n" +
    "            <div class=\"dayName row8 b-b animate\"\r" +
    "\n" +
    "                 ng-repeat=\"day in planningLeftColumn.days\"\r" +
    "\n" +
    "                    ng-class=\"{today: planning.isToday(day.dayOfYear())}\"\r" +
    "\n" +
    "                    ng-click=\"planning.dayCallback({$day:day})\">\r" +
    "\n" +
    "                <h4>\r" +
    "\n" +
    "                    {{day | format:'dddd' | capitalize}}<br>\r" +
    "\n" +
    "                    <small>{{day | format:'ll'}}</small>\r" +
    "\n" +
    "                </h4>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"days-body\" ng-switch-when=\"day\">\r" +
    "\n" +
    "            <div class=\"dayName row8 b-b animate\"\r" +
    "\n" +
    "                 ng-repeat=\"col in planningLeftColumn.column\">\r" +
    "\n" +
    "                <h4>\r" +
    "\n" +
    "                    {{col}}\r" +
    "\n" +
    "                </h4>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div style=\"height:10px\"><!-- compensate for scrollbar --></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('planning/directives/planning-line/planning-line.html',
    "<div class=\"b-b b-r all-day day-hour\"\r" +
    "\n" +
    "     ng-style=\"{width: line.calcWidth(line.zoom)}\"\r" +
    "\n" +
    "     ng-repeat=\"n in [] | range:line.range\"\r" +
    "\n" +
    "     ng-dblclick=\"line.clickEvent(n, $event)\">\r" +
    "\n" +
    "    <span class=\"half-hour\"></span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"event\"\r" +
    "\n" +
    "     ng-repeat=\"event in line._events\"\r" +
    "\n" +
    "     ng-style=\"event.style\"\r" +
    "\n" +
    "     ng-class=\"{'continued-before': event.continuedBefore, 'continued-after': event.continuedAfter}\"\r" +
    "\n" +
    "     ng-click=\"planning.eventCallback({'event':event})\"\r" +
    "\n" +
    "     tooltip-append-to-body=\"true\"\r" +
    "\n" +
    "     uib-tooltip=\"{{event.tooltip}}\">\r" +
    "\n" +
    "    <!--<span class=\"calendar-urgency bg-pink\"></span>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"event-line-container\" style=\"\">\r" +
    "\n" +
    "        <div class=\"event-line\" ng-style=\"{'background-color': event.color}\" ng-if=\"!event.continuedBefore\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"title-container\"><span>{{event.title}}</span></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('planning/directives/planning-top-row/planning-top-row.html',
    "<div class=\"planning-top-row\">\r" +
    "\n" +
    "    <div ng-repeat=\"hour in planningTopRow.hours\" class=\"day-hour\"\r" +
    "\n" +
    "         ng-style=\"{width: planningTopRow.calcWidth(planningTopRow.zoom), margin: planningTopRow.calcMargin(planningTopRow.zoom, $index)}\">\r" +
    "\n" +
    "        <h4>{{hour | format:'HH:mm'}}</h4>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('planning/directives/planning-week-line/planning-week-line.html',
    "<div class=\"week-line\" ng-class=\"'week-' + line.week \" style=\"padding-top:20px\">\r" +
    "\n" +
    "    <div class=\"multiple-days-events\" style=\"height:60%\">\r" +
    "\n" +
    "        <div class=\"week-event\" ng-repeat=\"event in line.displayedEvents\" style=\"width:100%; position:relative\"\r" +
    "\n" +
    "             ng-style=\"{ height:line.height}\">\r" +
    "\n" +
    "            <div\r" +
    "\n" +
    "                    ng-style=\"{'background-color': event.color, 'width': line.calculateWidth(event), 'left': line.calculateLeft(event)}\"\r" +
    "\n" +
    "                    style=\"height:100%; position:relative;border:1px solid black;\">\r" +
    "\n" +
    "                <span style=\"position:absolute; left:10px\">{{event.title}}</span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"single-day-events\" style=\"height:40%; width:100%\">\r" +
    "\n" +
    "        <div ng-repeat=\"ev in line.oneDayEvents\"\r" +
    "\n" +
    "             ng-style=\"{'background-color': ev.color,'left': line.calculateLeft(ev)}\" style=\"width:14.28%;height:20%\">\r" +
    "\n" +
    "            {{ev.start}}\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('planning/directives/planning/planning.html',
    "<div ng-if=\"planning.mode !=='month'\">\r" +
    "\n" +
    "    <zl-planning-left-column mode=\"planning.mode\" position=\"planning.position\" day-field=\"planning.dayField\"\r" +
    "\n" +
    "                             events=\"planning.sortedEvents\"></zl-planning-left-column>\r" +
    "\n" +
    "    <div class=\"\" style=\"height:100%\">\r" +
    "\n" +
    "        <div zl-horizontal-scroll scroll-left=\"planning.currentTimeToPixels()\" style=\"height:100%\">\r" +
    "\n" +
    "            <div ng-style=\"{width: planning.width}\" class=\"planning-body\">\r" +
    "\n" +
    "                <zl-planning-top-row mode=\"planning.mode\" zoom=\"planning.zoom\" position=\"planning.position\"\r" +
    "\n" +
    "                                     day-start=\"planning._dayStart\" day-end=\"planning._dayEnd\"></zl-planning-top-row>\r" +
    "\n" +
    "                <div class=\"hour-cursor\" ng-style=\"{left: planning.currentTimeToPixels()+'px'}\"\r" +
    "\n" +
    "                     ng-if=\"planning.isCurrent() && planning.isInDayRange()\">\r" +
    "\n" +
    "                    <div class=\"hour-caret\"></div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"planning-2pc\"></div>\r" +
    "\n" +
    "                <div ng-if=\"!planning.events.length\" style=\"position:fixed;left:50%;margin:auto\">{{'nothing_to_show' |\r" +
    "\n" +
    "                    strPlanning}}\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <zl-planning-line\r" +
    "\n" +
    "                        zoom=\"planning.zoom\"\r" +
    "\n" +
    "                        day-start=\"planning._dayStart\" day-end=\"planning._dayEnd\"\r" +
    "\n" +
    "                        ng-repeat=\"i in planning.keys(planning.sortedEvents)\" class=\"day b-b\"\r" +
    "\n" +
    "                        ng-class=\"{today: planning.isToday(i)}\" events=\"planning.getEvents(i)\"\r" +
    "\n" +
    "                        click-callback=\"planning.clickCallbackWrapper($hour, $minutes, i)\"></zl-planning-line>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-if=\"planning.mode =='month'\" class=\"month-container\">\r" +
    "\n" +
    "    <zl-planning-day ng-repeat=\"day in planning.days\" day=\"day\" events=\"planning._events\"></zl-planning-day>\r" +
    "\n" +
    "    <zl-planning-week-line ng-repeat=\"(week, events) in planning.multipleDaysEvents\" events=\"events\" week=\"week\" one-day-events=\"planning.oneDayEvents[week]\"></zl-planning-week-line>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
