;(function (angular) {
  'use strict'
  angular
    .module('90Tech.planning')
    .filter('day', [function () {
      return function (day) {
        if (day === undefined || day === null || isNaN(day) || parseInt(day) > 6) return ''
        return ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][day]
      }
    }])
})(window.angular)
