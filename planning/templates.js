angular.module('90Tech.planning').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('planning/directives/planning-day-block/planning-day.html',
    "<div class=\"day-block\" ng-class=\"{'empty-day': dayCtrl.isDefined }\" ng-click=\"planning.dayCallback({$day:dayCtrl.day.date})\">\n" +
    "    <div style=\"position:absolute;left:5px;top:5px;\" ng-if=\"dayCtrl.day.date.day() === 1\">{{dayCtrl.day.date.week()}}</div>\n" +
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
    "                    {{day | format:'dddd' | capitalize}}<br>\n" +
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
    "<div\n" +
    "        zl-planning-drag-drop\n" +
    "        zl-drop=\"line.dropEvent($data, $event)\">\n" +
    "    <div class=\"b-b b-r all-day day-hour\"\n" +
    "         ng-style=\"{width: line.calcWidth(line.zoom)}\"\n" +
    "         ng-repeat=\"n in [] | range:line.range\"\n" +
    "         ng-dblclick=\"line.clickEvent(n, $event)\"\n" +
    "         hour=\"{{n}}\">\n" +
    "        <span class=\"half-hour\"></span>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"event in line._events\"\n" +
    "     zl-planning-drag-drop\n" +
    "     ng-click=\"planning.eventCallback({'event':event})\"\n" +
    "     zl-drag=\"event\"\n" +
    "     ng-style=\"{\n" +
    "        height: event.style.height,\n" +
    "        top: event.style.top,\n" +
    "        width: event.pre > 0 ? line.preEvent[event.id].style.totalWidth : event.style.width,\n" +
    "        left: event.pre > 0 ? line.preEvent[event.id].style.left : event.style.left\n" +
    "    }\" style=\"position: absolute;\"\n" +
    ">\n" +
    "    <div ng-if=\"event.pre > 0\" ng-style=\"{width: line.preEvent[event.id].percentage, 'background': line.preEvent[event.id].style['background']}\"\n" +
    "         style=\"display: inline-block; position: relative; height: 100%; text-align: center; color: white; border: 1px lightgrey solid; border-right: none;\"\n" +
    "         class=\"pre-event\"\n" +
    "         tooltip-append-to-body=\"true\"\n" +
    "         uib-tooltip=\"{{line.preEvent[event.id].tooltip}}\">\n" +
    "        <div class=\"title-container\">\n" +
    "            <span>\n" +
    "            <i style=\"height: 100%; font-size: 1.2em;\" class=\"mdi mdi-car\"></i>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"event\" style=\"display: inline-block; position: relative; height: 100%;\"\n" +
    "         tooltip-append-to-body=\"true\"\n" +
    "         uib-tooltip=\"{{event.tooltip}}\"\n" +
    "         ng-style=\"{\n" +
    "         width: event.percentage,\n" +
    "         background: event.style['background-color'],\n" +
    "         color: event.style.color,\n" +
    "         'border-left': event.pre > 0 ? 'none': ''\n" +
    "         }\">\n" +
    "        <div class=\"event-line-container\" style=\"\">\n" +
    "            <div class=\"event-line\" ng-style=\"{'background-color': event.color}\" ng-if=\"!event.continuedBefore\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"title-container\"><span>{{event.title}}</span></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<!--<div class=\"event\"-->\n" +
    "<!--zl-planning-drag-drop-->\n" +
    "<!--zl-drag=\"event\"-->\n" +
    "<!--ng-repeat=\"event in line._events\"-->\n" +
    "<!--ng-style=\"event.style\"-->\n" +
    "<!--ng-class=\"{'continued-before': event.continuedBefore, 'continued-after': event.continuedAfter}\"-->\n" +
    "<!--ng-click=\"planning.eventCallback({'event':event})\"-->\n" +
    "<!--tooltip-append-to-body=\"true\"-->\n" +
    "<!--uib-tooltip=\"{{event.tooltip}}\">-->\n" +
    "<!--&lt;!&ndash;<span class=\"calendar-urgency bg-pink\"></span>&ndash;&gt;-->\n" +
    "\n" +
    "<!--<div class=\"event-line-container\" style=\"\">-->\n" +
    "<!--<div class=\"event-line\" ng-style=\"{'background-color': event.color}\" ng-if=\"!event.continuedBefore\"></div>-->\n" +
    "<!--</div>-->\n" +
    "\n" +
    "<!--<div class=\"title-container\"><span>{{event.title}}</span></div>-->\n" +
    "<!--</div>-->\n" +
    "\n"
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


  $templateCache.put('planning/directives/planning-vertical-line/planning-vertical-line.html',
    "<div\n" +
    "        zl-planning-drag-drop\n" +
    "        zl-drop=\"line.dropEvent($data, $event)\">\n" +
    "    <div class=\"b-b b-r all-day\"\n" +
    "         ng-style=\"{height: line.calcWidth(line.zoom)}\"\n" +
    "         ng-repeat=\"n in [] | range:line.range\"\n" +
    "         ng-dblclick=\"line.clickEvent(n, $event)\"\n" +
    "         hour=\"{{n}}\">\n" +
    "        <span class=\"half-hour\"></span>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"event in line._events\"\n" +
    "     zl-planning-drag-drop\n" +
    "     ng-click=\"planning.eventCallback({'event':event})\"\n" +
    "     zl-drag=\"event\"\n" +
    "     ng-style=\"{\n" +
    "        width: event.style.height,\n" +
    "        right: event.style.top,\n" +
    "        height: event.pre > 0 ? line.preEvent[event.id].style.totalWidth : event.style.width,\n" +
    "        top: event.pre > 0 ? line.preEvent[event.id].style.left : event.style.left\n" +
    "    }\" style=\"position: absolute;\"\n" +
    ">\n" +
    "<!--\n" +
    " TODO Uncomment me when everything else works\n" +
    " <div ng-if=\"event.pre > 0\" ng-style=\"{width: line.preEvent[event.id].percentage, 'background': line.preEvent[event.id].style['background']}\"\n" +
    "         style=\"display: inline-block; position: relative; height: 100%; text-align: center; color: white; border: 1px lightgrey solid; border-right: none;\"\n" +
    "         class=\"pre-event\"\n" +
    "         tooltip-append-to-body=\"true\"\n" +
    "         uib-tooltip=\"{{line.preEvent[event.id].tooltip}}\">\n" +
    "        <div class=\"title-container\">\n" +
    "            <span>\n" +
    "            <i style=\"width: 100%; font-size: 1.2em;\" class=\"mdi mdi-car\"></i>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    -->\n" +
    "    <div class=\"event\" style=\"display: inline-block; position: relative; width: 100%;\"\n" +
    "         tooltip-append-to-body=\"true\"\n" +
    "         uib-tooltip=\"{{event.tooltip}}\"\n" +
    "         ng-style=\"{\n" +
    "         height: event.percentage,\n" +
    "         background: event.style['background-color'],\n" +
    "         color: event.style.color,\n" +
    "         'border-left': event.pre > 0 ? 'none': ''\n" +
    "         }\">\n" +
    "        <div class=\"event-line-container\" style=\"\">\n" +
    "            <div class=\"event-line\" ng-style=\"{'background-color': event.color}\" ng-if=\"!event.continuedBefore\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"title-container\"><span>{{event.title}}</span></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<!--<div class=\"event\"-->\n" +
    "<!--zl-planning-drag-drop-->\n" +
    "<!--zl-drag=\"event\"-->\n" +
    "<!--ng-repeat=\"event in line._events\"-->\n" +
    "<!--ng-style=\"event.style\"-->\n" +
    "<!--ng-class=\"{'continued-before': event.continuedBefore, 'continued-after': event.continuedAfter}\"-->\n" +
    "<!--ng-click=\"planning.eventCallback({'event':event})\"-->\n" +
    "<!--tooltip-append-to-body=\"true\"-->\n" +
    "<!--uib-tooltip=\"{{event.tooltip}}\">-->\n" +
    "<!--&lt;!&ndash;<span class=\"calendar-urgency bg-pink\"></span>&ndash;&gt;-->\n" +
    "\n" +
    "<!--<div class=\"event-line-container\" style=\"\">-->\n" +
    "<!--<div class=\"event-line\" ng-style=\"{'background-color': event.color}\" ng-if=\"!event.continuedBefore\"></div>-->\n" +
    "<!--</div>-->\n" +
    "\n" +
    "<!--<div class=\"title-container\"><span>{{event.title}}</span></div>-->\n" +
    "<!--</div>-->\n" +
    "\n"
  );


  $templateCache.put('planning/directives/planning-week-line/planning-week-line.html',
    "<div class=\"week-line\" ng-class=\"'week-' + line.week \" style=\"padding-top:20px;\" >\n" +
    "    <div class=\"single-day-events\" style=\"height:40%; position:relative;\">\n" +
    "        <div\n" +
    "                zl-planning-drag-drop\n" +
    "                zl-drag=\"ev\"\n" +
    "                ng-repeat=\"ev in line.oneDayEvents\"\n" +
    "                ng-style=\"{'top': ev.style.top, 'height': ev.style.height, 'background-color': ev.style['background-color'], 'color' : ev.style.color, 'width': ev.style.width, 'left': ev.style.left}\"\n" +
    "                style=\"position:absolute;border: 1px solid black;pointer-events: auto; overflow: hidden;\"\n" +
    "                ng-click=\"planning.weekEventCallback({event: ev})\"\n" +
    "                tooltip-append-to-body=\"true\"\n" +
    "                uib-tooltip=\"{{ev.tooltip}}\"\n" +
    "                class=\"single-day-event\">\n" +
    "            <div class=\"event-line-container\">\n" +
    "                <div class=\"event-line\" ng-style=\"{'background-color': ev.color}\" ng-if=\"!ev.continuedBefore\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"single-day-event-title\">\n" +
    "                <span>{{ev.title}}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"multiple-days-events\" style=\"height:40%; position: relative;\">\n" +
    "        <div class=\"multiple-day-event\" ng-repeat=\"event in line.displayedEvents\"\n" +
    "             style=\"position: absolute; border: 1px solid black;pointer-events: auto; overflow: hidden;\"\n" +
    "             zl-planning-drag-drop\n" +
    "             zl-drag=\"event\"\n" +
    "             ng-click=\"planning.weekEventCallback({event: event})\"\n" +
    "             tooltip-append-to-body=\"true\"\n" +
    "             uib-tooltip=\"{{event.tooltip}}\"\n" +
    "             ng-style=\"{'top': event.style.top, 'height': event.style.height, 'background-color': event.style['background-color'], 'color' : event.style.color, 'width': event.style.width, 'left': event.style.left}\">\n" +
    "            <div class=\"event-line-container\">\n" +
    "                <div class=\"event-line\" ng-style=\"{'background-color': event.color}\"\n" +
    "                     ng-if=\"!event.continuedBefore\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"multiple-day-event-title\">\n" +
    "                <span>{{event.title}}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('planning/directives/planning/planning.html',
    "<div ng-if=\"planning.mode ==='day' || planning.mode === 'week'\" style=\"height: 100%;\">\n" +
    "    <zl-planning-left-column mode=\"planning.mode\" position=\"planning.position\" day-field=\"planning.dayField\"\n" +
    "                             events=\"planning.sortedEvents\"></zl-planning-left-column>\n" +
    "    <div class=\"\" style=\"height:100%\">\n" +
    "        <div zl-horizontal-scroll scroll-left=\"planning.currentTimeToPixels()\" style=\"height:100%\">\n" +
    "            <div ng-style=\"{width: planning.width}\" class=\"planning-body\">\n" +
    "                <zl-planning-top-row mode=\"planning.mode\" zoom=\"planning.zoom\" position=\"planning.position\"\n" +
    "                                     day-start=\"planning._dayStart\" day-end=\"planning._dayEnd\"></zl-planning-top-row>\n" +
    "                <div class=\"hour-cursor\" ng-style=\"{left: planning.currentTimeToPixels()+'px'}\"\n" +
    "                     ng-if=\"planning.isCurrent() && planning.isInDayRange()\">\n" +
    "                    <div class=\"hour-caret\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"planning-2pc\"></div>\n" +
    "                <div ng-if=\"!planning.events.length\" style=\"position:fixed;left:50%;margin:auto\">{{'nothing_to_show' |\n" +
    "                    strPlanning}}\n" +
    "                </div>\n" +
    "                <zl-planning-line\n" +
    "                        zoom=\"planning.zoom\"\n" +
    "                        day-start=\"planning._dayStart\" day-end=\"planning._dayEnd\"\n" +
    "                        ng-repeat=\"i in planning.keys(planning.sortedEvents)\" class=\"day b-b\"\n" +
    "                        ng-class=\"{today: planning.isToday(i)}\" events=\"planning.getEvents(i)\"\n" +
    "                        drop-callback=\"planning.dropEventWeekMode($hour, $minutes, i, $data, $event)\"\n" +
    "                        click-callback=\"planning.clickCallbackWrapper($hour, $minutes, i)\"></zl-planning-line>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"planning.mode ==='week-advanced'\" class=\"advanced-week\">\n" +
    "    <div class=\"days-list\">\n" +
    "        <div class=\"day-advanced\">&nbsp;</div>\n" +
    "        <div class=\"day-advanced\" ng-repeat=\"day in planning.allowedDays\">\n" +
    "            <span class=\"day-text\"\n" +
    "            >{{day | day}}</span></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"advanced-week-container\"\n" +
    "         ng-repeat=\"(name,v) in planning.sortedEvents\">\n" +
    "        <div class=\"left-column-advanced\">\n" +
    "            <span style=\"margin:auto\">{{name}}</span>\n" +
    "        </div>\n" +
    "        <div ng-repeat=\"day in planning.allowedDays\"\n" +
    "             class=\"day-advanced\">\n" +
    "            <zl-planning-vertical-line\n" +
    "                    zoom=\"planning.zoom\"\n" +
    "                    day-start=\"planning._dayStart\" day-end=\"planning._dayEnd\"\n" +
    "                    events=\" planning.getEvents(name)[day]\">\n" +
    "            </zl-planning-vertical-line>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div ng-if=\"planning.mode === 'month'\" style=\"height: 100%; z-index: 1000;\">\n" +
    "    <div class=\"month-header\">\n" +
    "        <span class=\"month-text\">{{planning.month | capitalize}}</span>\n" +
    "    </div>\n" +
    "    <div class=\"day-header\">\n" +
    "        <div class=\"day\" ng-repeat=\"day in []|range:7\"><span class=\"day-text\">{{day | day}}</span></div>\n" +
    "    </div>\n" +
    "    <div class=\"month-container\">\n" +
    "        <zl-planning-day ng-repeat=\"day in planning.days\" day=\"day\" events=\"planning._events\"\n" +
    "                         drop-callback=\"planning.dropEvent($data, $event, day.date)\"\n" +
    "                         ng-dblclick=\"planning.clickWeekEvent(day, $event)\"></zl-planning-day>\n" +
    "        <zl-planning-week-line ng-repeat=\"(week, events) in planning.multipleDaysEvents\" events=\"events\" week=\"week\"\n" +
    "                               one-day-events=\"planning.oneDayEvents[week]\"\n" +
    "                               style=\"height: 20%; pointer-events: none\"></zl-planning-week-line>\n" +
    "    </div>\n" +
    "</div>\n"
  );

}]);
