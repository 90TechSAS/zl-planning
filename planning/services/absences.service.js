;(function (angular, _, moment) {
  'use strict'
  angular.module('90Tech.planning')
    .service('AbsenceService', AbsenceService)

  function AbsenceService () {
    var self = this
    _.extends(self, {
      // Public Attributes
      // Public Methods
      parseAbsences: parseAbsences
    })

    function parseAbsences (absences, interval) {
      if (!Array.isArray(interval)) {
        throw new Error('Invalid interval')
      }
      var parsed = absences.map(function (absence) {
        if (moment(absence.start).isBefore(moment(interval[0]))) {
          absence.start = interval[0]
        }
        if (moment(absence.end).isAfter(moment(interval[1]))) {
          absence.end = interval[1]
        }
      })
    }

    function checkOverlap (range1, range2) {
      if (moment.range(range1).overlap(range2)) {

      }
    }
  }

})(window.angular, window._, window.moment)
