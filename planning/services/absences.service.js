;(function (angular, _, moment) {
  'use strict'
  angular.module('90Tech.planning')
    .service('AbsenceService', AbsenceService)

  function AbsenceService () {
    var self = this
    _.extend(self, {
      // Public Attributes
      // Public Methods
      parseAbsences: parseAbsences
    })

    function parseAbsences (absences, interval) {
      if (!Array.isArray(interval)) {
        throw new Error('Invalid interval')
      }
      var parsed = absences.filter(function (abs) {
        return moment.range(abs.start, abs.end).overlaps(moment.range(interval[0], interval[1]))
      }).map(function (absence) {
        if (moment(absence.start).isBefore(moment(angular.copy(interval[0])))) {
          absence.start = interval[0]
        }
        if (moment(absence.end).isAfter(moment(angular.copy(interval[1])))) {
          absence.end = interval[1]
        }
        return absence
      })
      return mergeRanges(parsed)
    }

    function mergeRanges (ranges) {
      var copy = ranges.map(function (r, index) {
        r.index = index
        return r
      })
      // Check if any ranges overlaps
      // If none overlap, return array
      if (!_.any(copy, function (range1) {
        return _.any(copy, function (range2) {
          if (range1.index === range2.index) {
            return false
          }
          return overlaps(range1, range2)
        })
      })) {
        return ranges
      }
      var reduced = ranges.reduce(function (acc, value, index, arr) {
        if (index + 1 === arr.length - 1) {
          return acc
        }
        var next = arr[index + 1]
        if (overlaps(moment.range(value, next))) {
          acc.push({start: moment.min(value.start, next.start), end: moment.max(value.end, next.end)})
        }
        return acc
      })

      return mergeRanges(reduced)
    }

    function overlaps (range1, range2) {
      return moment.range(range1.start, range1.end).overlaps(moment.range(range2.start, range2.end))
    }
  }

})(window.angular, window._, window.moment)
