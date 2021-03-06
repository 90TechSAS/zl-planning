;(function (angular) {
  'use strict'

  angular
    .module('90Tech.planning')
    .filter('format', function () {
      return function (time, format) {
        return time.format(format)
      }
    })
    .filter('capitalize', function () {
      return function (str) {
        if (!str) return ''
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    })
})(window.angular)
