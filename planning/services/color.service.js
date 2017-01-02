;(function (angular, _, moment) {
  'use strict'

  angular
    .module('90Tech.planning')
    .service('ColorService', ColorService)

  ColorService.$inject = []

  function ColorService () {
    var self = this

    _.extend(self, {
      getLuminance: getLuminance
    })


    /**
     * return the luminance of a color : > 200 is black
     * @param c Color
     * @returns {number}
     */
    function getLuminance (c) {
      c = c || '#ffffff'
      var r, g, b
      var rgbRegex = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/
      if (rgbRegex.test(c)){
          var exec = rgbRegex.exec(c)
           r = parseInt(exec[1])
           g = parseInt(exec[2])
           b = parseInt(exec[3])
      } else {
        var color = c.substring(1) // strip #
        var rgb = parseInt(color, 16) // convert rrggbb to decimal
        r = (rgb >> 16) & 0xff // extract red
        g = (rgb >> 8) & 0xff // extract green
        b = (rgb >> 0) & 0xff // extract blue
      }

      var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
      // luma > 200 : black
      return luma
    }

  }
}(window.angular, window._, window.moment))
