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

    function overlap (lines, event) {
      for (var i = 0; i < lines.length; i++) {
        if (!lines[i].length) {
          lines[i].push(event)
          event.line = i
          break
        }
        if (_.filter(lines[i], function (elt) {
          if (event.range.overlaps(elt.range)) {
            elt.depth += 1
            return true
          } }).length) {
          event.depth += 1
          if (!lines[i + 1]) {
            lines[i + 1] = []
          }
          continue
        } else {
          lines[i].push(event)
          event.line = i
          break
        }
      }
    }
  }
}(window.angular, window._, window.moment))
