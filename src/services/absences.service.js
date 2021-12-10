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
        absence.style = {}
        if (moment(absence.start).isSame(moment(angular.copy(interval[0]))) ) {
          absence.style.top = 0 + 'px'
          absence.start = interval[0]
        }
        if (moment(absence.start).isBefore(moment(angular.copy(interval[0])))) {
          absence.start = interval[0]
          absence.style.top = 0 + 'px'
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
        return Object.assign({}, r, {index: index})
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
        var next = arr[index + 1]
        if (!next || !value) {
          return acc
        }
        if (overlaps(
          {
            start: moment(angular.copy(value.start)).toDate(),
            end: moment(angular.copy(value.end)).toDate()
          }, {
            start: moment(angular.copy(next.start)).toDate(),
            end: moment(angular.copy(next.end)).toDate()
          })) {
          acc.push({
            start: moment.min(
              moment(angular.copy(value.start)),
              moment(angular.copy(next.start))
            ),
            end: moment.max(
              moment(angular.copy(value.end)),
              moment(angular.copy(next.end))
            )
          })
        }
        return acc
      }, [])

      return mergeRanges(reduced)
    }

    function overlaps (range1, range2) {
      return moment.range(range1.start, range1.end).overlaps(moment.range(range2.start, range2.end))
    }
  }

})(window.angular, window._, window.moment)
