;(function (angular, _, moment) {
  'use strict'
  angular.module('90Tech.planning')
    .service('HolidaysServicePlanning', HolidaysServicePlanning)

  function HolidaysServicePlanning () {
    var self = this
    _.extend(self, {
      // Public Attributes
      solidarityDays: [],
      aliaCompanySettings: {
        showSolidarityDay: false
      },
      // Public Methods
      isSolidarityDay
    })

    function isSolidarityDay (day) {
      let bool = false
      if(day && _.get(self.aliaCompanySettings, 'showSolidarityDay', false)){
        if (day.solidarity && day.solidarityTouched) return true
        if(moment.isMoment(day)) day.solidarityTouched = true
        self.solidarityDays.forEach((solidarityDay) => {
          if (
            moment(solidarityDay.start).unix() <= moment(day).endOf('day').unix() &&
            moment(solidarityDay.end).unix() >= moment(day).endOf('day').unix()
          ) {
            day.solidarity = true
            day.solidarityTouched = true
            bool = true
          }
        })
      }
      return bool
    }
  }

})(window.angular, window._, window.moment)
