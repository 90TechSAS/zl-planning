angular.module('90Tech.planning').run(['$templateCache', function($templateCache) {
  'use strict';

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
    "    <div style=\"height:15px\"><!-- compensate for scrollbar --></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('planning/directives/planning-line/planning-line.html',
    "<div class=\"b-b b-r all-day day-hour\"\r" +
    "\n" +
    "     ng-repeat=\"n in [] | range:24\">\r" +
    "\n" +
    "<span class=\"half-hour\"></span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"event\"\r" +
    "\n" +
    "     ng-repeat=\"event in line.events\"\r" +
    "\n" +
    "     ng-style=\"event.style\"\r" +
    "\n" +
    "     ng-class=\"{'continued-before': event.continuedBefore, 'continued-after': event.continuedAfter}\"\r" +
    "\n" +
    "     ng-click=\"planning.eventCallback({'event':event})\">\r" +
    "\n" +
    "    <!--<span class=\"calendar-urgency bg-pink\"></span>-->\r" +
    "\n" +
    "    <div class=\"event-line\" ng-style=\"{'background-color': event.color}\" ng-if=\"!event.continuedBefore\"></div>\r" +
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
    "    <div ng-repeat=\"hour in planningTopRow.hours\" class=\"day-hour\">\r" +
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


  $templateCache.put('planning/directives/planning/planning.html',
    "<zl-planning-left-column mode=\"planning.mode\" position=\"planning.position\" day-field=\"planning.dayField\"\r" +
    "\n" +
    "                         events=\"planning.sortedEvents\"></zl-planning-left-column>\r" +
    "\n" +
    "<div class=\"\" style=\"height:100%\">\r" +
    "\n" +
    "    <div zl-horizontal-scroll scroll-left=\"planning.currentTimeToPixels()\" style=\"height:100%\">\r" +
    "\n" +
    "        <div class=\"planning-body\">\r" +
    "\n" +
    "            <zl-planning-top-row mode=\"planning.mode\" position=\"planning.position\"></zl-planning-top-row>\r" +
    "\n" +
    "            <div class=\"hour-cursor\" ng-style=\"{left: planning.currentTimeToPixels()+'px'}\"\r" +
    "\n" +
    "                 ng-if=\"planning.isCurrentWeek()\">\r" +
    "\n" +
    "                <div class=\"hour-caret\"></div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"planning-2pc\"></div>\r" +
    "\n" +
    "                <zl-planning-line ng-repeat=\"(i, e) in planning.sortedEvents\" class=\"day b-b\"\r" +
    "\n" +
    "                                  ng-class=\"{today: planning.isToday(i)}\" events=\"e\"></zl-planning-line>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );

}]);
