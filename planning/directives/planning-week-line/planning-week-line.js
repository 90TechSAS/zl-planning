(function () {

  'use strict';

  angular
    .module('90Tech.planning')
    .directive('zlPlanningWeekLine', PlanningLineDirective);

  PlanningLineController.$inject = [];

  /**
   *
   */
  function PlanningLineController () {
    var self = this

    function init () {
      self.displayedEvents = _(self.events).sortBy(function (event) {
        return event.continuedBefore ? -1 : (event.continuedAfter ? 0 : 1)
      }).value()
      self.lines = [[]];
      _.each(self.displayedEvents, function(event){
        event.style = {}
        event.depth = 1
        event.range = moment.range(event.start, event.end)
        event.style.left = calculateLeft(event)
        event.style.width = calculateWidth(event)
        line:
            for (var i = 0; i < self.lines.length; i++){
              if (!self.lines[i].length){
                self.lines[i].push(event);
                event.line = i;
                break line;
              }

              if (_.filter(self.lines[i], function(elt){
                    if (event.range.overlaps(elt.range)){
                      elt.depth += 1;
                      return true;
                    } else if ((event.range.start.day() === elt.range.end.day()) || (event.range.start.day() === elt.range.start.day())) {
                      elt.depth +=1;
                      return true;
                    }
                  }).length){
                event.depth += 1;
                if (!self.lines[i + 1]){
                  self.lines[i + 1] = [];
                }
                continue line;
              } else{
                //console.log(event.title, i)
                self.lines[i].push(event);
                event.line = i;
                break line;
              }
            }
      })
      _.each(self.displayedEvents, function(event){
        event.style.top = Math.round((event.line) * 100 / self.lines.length) + '%'
        event.style.height = Math.round(100 / self.lines.length) + '%'
        if (event.title === 'e1' || event.title === 'e0bis') {
          
        }
      })
      self.lh = Math.round(100 / self.lines.length) + '%'
      console.log('/////////')
      console.log('displayedEvents',self.displayedEvents)
      console.log('lines',self.lines)
      console.log('/////////')
      //self.height = Math.floor(100 / self.displayedEvents.length) + '%'

    }

    init()

    function calculateWidth (event) {
      if (event.end.diff(event.start, 'days') + 1 > 7) {
        console.info(event.end.diff(event.start, 'days') + 1)
      }
      return (event.end.diff(event.start, 'days') + 1) * 14.28 + '%'
    }

    function calculateLeft (event) {
      return ((event.start.date() - 1) % 7 ) * 14.28 + '%'

    }

    _.extend(self, {
      calculateWidth: calculateWidth,
      calculateLeft: calculateLeft
    })
  }

  /**
   *
   */
  function PlanningLineDirective () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'planning/directives/planning-week-line/planning-week-line.html',
      controller: PlanningLineController,
      controllerAs: 'line',
      bindToController: {
        events: '=',
        week: '=',
        oneDayEvents: '='
      },
      scope: true
    };

  }

})
();
