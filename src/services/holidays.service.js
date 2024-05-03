;(function (angular, _, moment) {
  'use strict'
  angular.module('90Tech.planning')
    .service('HolidaysService', HolidaysService)

  function HolidaysService () {
    var self = this
    _.extend(self, {
      // Public Attributes
      solidarityDays: [],
      // Public Methods
      isSolidarityDay
    })

    function isSolidarityDay (day) {
      let bool = false
      if (day.solidarity && day.solidarityTouched) return true
      day.solidarityTouched = true
      self.solidarityDays.forEach((solidarityDay) => {
        if (
          moment(solidarityDay.start).unix() <= moment(day).unix() &&
          moment(solidarityDay.end).unix() >= moment(day).unix()
        ) {
          day.solidarity = true
          day.solidarityTouched = true
          bool = true
        }
      })
      return bool
    }
  }

})(window.angular, window._, window.moment)
