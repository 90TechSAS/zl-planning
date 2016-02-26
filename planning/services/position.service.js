;(function (angular, _, moment) {
  'use strict'

  angular
    .module('90Tech.planning')
    .service('PositionService', PositionService)

  PositionService.$inject = []

  function PositionService () {
    var self = this

    _.extend(self, {
      // Public Methods
      overlap: overlap
    })

    /**
     * Check if event overlap any events in line, merge if parallel items is over maxParallelEvents, and push event in toRemove
     * @param lines Arrays, containing events example : [[event, event][event,event][event]]
     * @param event Event
     * @param maxParallelEvents Int, maximum parallelEvents
     * @param toRemove Array containing event which have been integrated/merged with another event
     * @param doublecheck Boolean If true, check if day isn't same between two events (useful for monthly view where hours doesn't overlap on same day)
     */
    function overlap (lines, event, maxParallelEvents, toRemove, doublecheck) {
      for (var i = 0; i < lines.length; i++) {
        if (event.depth > maxParallelEvents) {
          var overlap = false
          _.each(lines[maxParallelEvents], function (elt) {
            overlap = event.range.overlaps(elt.range)
            if (!overlap && doublecheck) {
              overlap = (event.start.day() === elt.start.day() || event.start.day() === elt.end.day() || event.end.day() === elt.start.day() || event.end.day() === elt.end.day())
            }
            if (overlap) {
              elt.start = moment.min(event.start, elt.start) // set start to minimum of 2 overlapping event
              elt.end = moment.max(event.end, elt.end)  // set end to maximum of 2 overlapping event
              elt.range = moment.range(elt.start, elt.end) // Update range
              elt.line = maxParallelEvents
              elt.eventList.push(event)
              if (elt.technician !== event.technician) { // Technician isn't the same, hide it
                elt.technician = ''
                event.technician = ''
              }
            }
          })
          if (overlap) {
            toRemove.push(event)
            break
          }
          event.depth = maxParallelEvents
          event.line = maxParallelEvents
          if (!event.eventList) {
            var eventClone = _.cloneDeep(event)
            event.eventList = [eventClone]
          }
          lines[maxParallelEvents].push(event)
          break
        }
        if (!lines[i].length) {
          lines[i].push(event)
          event.line = i
          break
        }
        if (_.filter(lines[i], function (elt) { // if any event in lines[i] overlap
          overlap = event.range.overlaps(elt.range)
          if (!overlap && doublecheck) {
            overlap = (event.start.day() === elt.start.day() || event.start.day() === elt.end.day() || event.end.day() === elt.start.day() || event.end.day() === elt.end.day())
          }
          if (overlap) {
            elt.depth += 1
            return true
          } }).length) {
          event.depth += 1
          if (!lines[i + 1]) { // if next line is doesn't exist, add one
            lines[i + 1] = []
          }
        } else {
          lines[i].push(event)
          event.line = i
          break
        }
      }
    }
  }
}(window.angular, window._, window.moment))
