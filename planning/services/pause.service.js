;(function (angular, _, moment) {
  'use strict'
  angular.module('90Tech.planning')
    .service('PauseService', PauseService)

  PauseService.$inject = ['ColorService']

  function PauseService (ColorService) {
    var self = this

    _.extend(self, {
      // Public Attributes
      // Public Methods
      generateGradient: generateGradient
    })

    function generateGradient (event, direction) {
      var color = event.style['background-color']
      var pauseColor = invertColor(color)
      var start = event.start
      var end = event.end
      var totalRange = moment.range(start, end)
      var totalDuration = totalRange.diff('milliseconds')

      function parsePause (pauses) {
        return _.map(pauses, function (pause) {
          var start = event.start.isAfter(pause.start) ? event.start : pause.start
          var end = event.end.isBefore(pause.end) ? event.end : pause.end
          var pauseRange = moment.range(start, end)
          var pauseDuration = pauseRange.diff('milliseconds')
          var percentage = pauseDuration / totalDuration * 100
          var before = totalRange.subtract(pauseRange)
          if (!before.length) {
            return {range: pauseRange, endPercentage: 100, startPercentage: 0}
          }
          var v = (before[0].diff('milliseconds') || totalDuration) / totalDuration * 100
          return {range: pauseRange, endPercentage: percentage + v, startPercentage: v}
        })
      }

      var mapped = parsePause(event.pauses)

      var reduced = _.reduce(mapped, function (acc, range) {
        return acc + ', ' + color + ' ' + range.startPercentage + '%, ' + pauseColor + ' ' + range.startPercentage + '%, ' + pauseColor + ' ' + range.endPercentage + '%, ' + color + ' ' + range.endPercentage + '%'
      }, 'linear-gradient(' + direction + ', ' + color)

      reduced += ', ' + color + ' 100%)'
      return reduced
    }

    function invertColor (hex) {
      if (hex.indexOf('#') === 0) {
        hex = hex.slice(1)
      }
      // convert 3-digit hex to 6-digits.
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      }
      if (hex.length !== 6) {
        throw new Error('Invalid HEX color.')
      }
      // invert color components
      var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16)
      // pad each with zeros and return
      return '#' + padZero(r) + padZero(g) + padZero(b)
    }

    function padZero (str, len) {
      len = len || 2
      var zeros = new Array(len).join('0')
      return (zeros + str).slice(-len)
    }
  }

})(window.angular, window._, window.moment)
