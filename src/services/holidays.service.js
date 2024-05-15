;(function (angular, _, moment) {
  'use strict'
  angular.module('90Tech.planning')
    .service('HolidaysServicePlanning', HolidaysServicePlanning)

  function HolidaysServicePlanning () {
    var self = this
    _.extend(self, {
      // Public Attributes
      solidarityDays: [],
      masterDayRange: [],
      aliaCompanySettings: {
        showSolidarityDay: false
      },
      // Public Methods
      isSolidarityDay
    })

    function isSolidarityDay (day) {
      let bool = false
      if(day && _.get(self.aliaCompanySettings, 'showSolidarityDay', false)){
        const parsedDay = moment(day)
        self.solidarityDays.forEach((solidarityDay) => {
          if(solidarityDay.master) self.masterDay = solidarityDay
          if(parsedDay.get('year') >= _.get(self.masterDay, 'year')){
            const filter = self.masterDayRange.filter(elt => moment(elt.date).get('year') === moment(parsedDay).get('year') && elt.rule === self.masterDay.rule)
            if(filter.length){
              solidarityDay = filter[0]
            }
          }
          if (
            moment(solidarityDay.start).unix() <= moment(parsedDay).endOf('day').unix() &&
            moment(solidarityDay.end).unix() >= moment(parsedDay).endOf('day').unix()
          ) {
            bool = true
          }
        })
      }
      return bool
    }
  }

})(window.angular, window._, window.moment)
