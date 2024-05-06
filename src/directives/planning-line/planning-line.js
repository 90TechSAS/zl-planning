;(function (angular, _, moment) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanningLine', PlanningLineDirective)

  PlanningLineController.$inject = ['$scope', 'planningConfiguration', 'PositionService', 'ColorService', 'PauseService', 'AbsenceService', 'HolidaysServicePlanning']

  /**
   *
   */
  function
  PlanningLineController ($scope, planningConfiguration, PositionService, ColorService, PauseService, AbsenceService, HolidaysServicePlanning) {

    var BASE_SIZE = planningConfiguration.BASE_SIZE
    var parallelText = planningConfiguration.parallelText
    var MAX_PARALLEL = planningConfiguration.MAX_PARALLEL

    var self = this

    self.$onInit = function () {
      _.extend(self, {
        clickEvent: clickEvent,
        calcWidth: calcWidth,
        dropEvent: dropEvent,
        hoverAbsence: hoverAbsence,
        leaveAbsence: leaveAbsence
      })
      init()
      $scope.$watchCollection(function () {
        return [self.events, self.dayStart, self.dayEnd]
      }, init)

      $scope.$watchCollection(function () {
        return [self.absences]
      }, function (newValue, oldValue) {
        if (Array.isArray(self.absences) && self.absences.length) {
          var start = moment(angular.copy(self.position)).startOf('day')
          var end = moment(angular.copy(self.position)).endOf('day')
            self._absences = AbsenceService.parseAbsences(self.absences , [start, end]).map(function (abs) {
                abs.style = {
                left: (moment(abs.start).hours() - self.dayStart.h) * BASE_SIZE * self.zoom + moment(abs.start).minutes() * BASE_SIZE * self.zoom / 60 + 'px',
                width: self.zoom * self.SLIDER_WIDTH * (moment.range(abs.start, abs.end).valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px'
              }
              abs.range = moment.range(abs.start, abs.end)
              abs.class = 'planning-absence-' + abs.confirmation.state
              abs.tooltip = setAbsenceTooltip(abs)
              return abs
            })

        } else if (self.absences) {
          var start = moment(angular.copy(self.dayOfWeek)).startOf('day')
          var end = moment(angular.copy(self.dayOfWeek)).endOf('day')
          self._absences = []
          for (const [key, value] of Object.entries(self.absences)) {
            value.forEach(absence => {
              if(self.dayOfWeek.isBetween(moment(absence.start), moment(absence.end)) || (moment(self.dayOfWeek).isSame(moment(absence.start),'day') && moment(self.dayOfWeek).isSame(moment(absence.end),'day'))){
                self._absences.push(angular.copy(absence))
              }
            })
          }
          self._absences.forEach(absence => {
            let index = self._absences.indexOf(absence)
            if (
              (moment(absence.start).isBefore(moment(self.dayOfWeek).startOf('day')) && (moment(absence.end).isAfter(moment(self.dayOfWeek).endOf('day')))) ||
              (moment(absence.end).isSame(moment(self.dayOfWeek).endOf('day')) && moment(absence.start).isBefore(moment(self.dayOfWeek).startOf('hour'))) ||
              ((moment(absence.start).isSame(moment(self.dayOfWeek).startOf('day')) && (moment(absence.end).isAfter(moment(self.dayOfWeek).endOf('day')))))){
              absence.start = moment(self.dayOfWeek).startOf('day')
              absence.end = moment(self.dayOfWeek).endOf('day')
            }

            absence.style = {
              left: (moment(absence.start).hours() - self.dayStart.h) * BASE_SIZE * self.zoom + moment(absence.start).minutes() * BASE_SIZE * self.zoom / 60 + 'px',
              width: self.zoom * self.SLIDER_WIDTH * (moment.range(absence.start, absence.end).valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px',
              height: (100 / self._absences.length) + '%',
              position: 'absolute',
              top: (100 / self._absences.length) * index + '%'
              }
              absence.range = moment.range(absence.start, absence.end)
              absence.class = 'planning-absence-' + absence.confirmation.state
              absence.tooltip = setAbsenceTooltip(absence)
              absence.index = index
          })
        } else {
          self._absences = []
        }
      })
    }

    self.log = function (a) {
    }

    self.replace = function (string) {
      if (!string) return
      return string.replace(/([a-zA-Z\ ])\w+/, '')
    }

    self.preEvent = {}
    self.postEvent = {}

    function setAbsenceTooltip(abs) {
        let state = ''
        const absenceType = abs.absenceType
        const userName = self.mode === 'week' ? abs.user.fullname + ' - ' : ''
        switch (abs.confirmation.state) {
            case 'sending':
                state = userName + 'Absence envoyée'
                break
            case 'pending':
                state = userName + 'Absence en cours de traitement'
                break
            case 'partial-accepted':
                state = userName + 'Absence en cours de traitement'
                break;
            case 'accepted':
                state = userName + 'Absence acceptée'
                break
        }
        if(absenceType) {
            return state + '\nRaison: '+ absenceType
        } else {
            return state
        }
    }
    function extractMinutesFromEvent($event){
      var minutes
      if (_.contains($event.target.classList, 'half-hour')) {
        // If the user has clicked right on the half-hour line, offsetX is 0
        minutes = 30
      } else {
        minutes = Math.floor($event.offsetX / (BASE_SIZE * self.zoom) * 60)
      }
      return minutes
    }

    function hoverAbsence(absence) {
      self.tooltip = setAbsenceTooltip(absence)
      for (const iterator of document.getElementsByClassName(absence._id)) {
        iterator.classList.add('absence-hover')
      }
    }

    function leaveAbsence() {
      for (const iterator of document.getElementsByClassName('absence')) {
        iterator.classList.remove('absence-hover')
      }
    }

    function dropEvent (data, event, line) {
      var hour = parseInt(event.target.getAttribute('hour'))
      var minutes = extractMinutesFromEvent(event)
      var date = moment(angular.copy(self.position)).hours(hour + parseInt(self.dayStart.h)).minutes(minutes)
      var day = line.dayOfWeek ? line.dayOfWeek : line.position
      if (checkAbsence(date) && checkFerie(day)) {
        planningConfiguration.warningCallback(function () {
          self.dropCallback({ $data: data, $event: event, $hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        })
      } else if (checkAbsence(date) && !checkFerie(day)) {
        planningConfiguration.absentTechnicianCallback(function () {
          self.dropCallback({ $data: data, $event: event, $hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        })
      } else if (!checkAbsence(date) && checkFerie(day)) {
        if(!HolidaysServicePlanning.isSolidarityDay(day)){
        planningConfiguration.isFerieCallback(function () {
          self.dropCallback({ $data: data, $event: event, $hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        })} else {
          self.dropCallback({ $data: data, $event: event, $hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        }
      } else {
        self.dropCallback({ $data: data, $event: event, $hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
      }
    }

    function clickEvent (hour, $event, line) {
      let day = !!line.dayOfWeek ? line.dayOfWeek : line.position
      var minutes = extractMinutesFromEvent($event)
      var date = moment(angular.copy(self.position)).hours(hour + parseInt(self.dayStart.h)).minutes(minutes)
      if (checkAbsence(date) && checkFerie(day)) {
        planningConfiguration.warningCallback(function () {
          self.clickCallback({$hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        })
      } else if (checkAbsence(date) && !checkFerie(day)) {
        planningConfiguration.absentTechnicianCallback(function () {
          self.clickCallback({$hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        })
      } else if (!checkAbsence(date) && checkFerie(day)) {
        if(!HolidaysServicePlanning.isSolidarityDay(day)){
        planningConfiguration.isFerieCallback(function () {
          self.clickCallback({$hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        })} else {
          self.clickCallback({$hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
        }
      } else {
        self.clickCallback({$hour: hour + parseInt(self.dayStart.h), $minutes: minutes})
      }
    }

    function init () {
      var currentId = 0
      //     self.SLIDER_WIDTH   = 24 * BASE_SIZE
      self.preEvent = {}
      self.postEvent = {}
      self.breaks = []

      self._events = angular.copy(self.events)

      self.range = self.dayEnd.h - self.dayStart.h
      self.SECONDS_BY_DAY = 3600 * self.range
      self.SLIDER_WIDTH = BASE_SIZE * self.range

      // Pre-sort events by start Date
      self._events = _.sortBy(self._events, function (e) {
        return e.start.valueOf()
      })

      var lines = [[]]
      var toremove = []
      _.each(self._events, function (event) {
        var style = {}
        event.depth = 1
        event.range = moment.range(event.start, event.end)
        if (event.range < 900000) {
          var end = moment(event.start).add(15, 'minutes')
          event.range = moment.range(event.start, end)
        }
        style.left = (event.start.hours() - self.dayStart.h) * BASE_SIZE * self.zoom + event.start.minutes() * BASE_SIZE * self.zoom / 60 + 'px'
        //   style.left                = event.start.hours() * 150 + event.start.minutes() * 150 / 60 + 'px'
        style.width = self.zoom * self.SLIDER_WIDTH * (event.range) / self.SECONDS_BY_DAY / 1000 + 'px'
        style['background-color'] = event['background-color'] || '#778899'
        if (ColorService.getLuminance(style['background-color'])> 200){
          style.color = 'black'
        } else {
          style.color = 'white'
        }
        event.style = style
        PositionService.overlap(lines, event, MAX_PARALLEL, toremove)
      })
      self._events = _.difference(self._events, toremove)
      _.each(self._events, function (event) {
        event.id = angular.copy(currentId)
        if (event.line === MAX_PARALLEL) {
          event.style.left = (event.start.hours() - self.dayStart.h) * BASE_SIZE * self.zoom + event.start.minutes() * BASE_SIZE * self.zoom / 60 + 'px'
          event.style.width = self.zoom * self.SLIDER_WIDTH * (event.range.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px'
          event.style['background-color'] = '#000'
          event.style['font-weight'] = 'bold'
          event.style.color = '#fff'
          event.title = (event.eventList.length) + ' ' + parallelText
          if (event.tooltip) event.tooltip = event.title
        }
        event.style.width = self.zoom * self.SLIDER_WIDTH * (event.range.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px'
        if (event.line === undefined) event.line = MAX_PARALLEL
        event.style.top = Math.round((parseInt(event.line)) * 70 / lines.length) + '%'
        event.style.height = Math.round(70 / lines.length) + '%'
        event.percentage = '100%'
        if (event.pre > 0) {
          event.style['border-left'] = 'none'
          var s = moment(event.start).subtract(event.pre, 'minutes')
          if (!moment(s).isSame(event.start, 'day')) {
            s = moment(event.start).startOf('day')
          }
          var e = moment(event.start)
          var r = moment.range(s, e)
          var totalRange = moment.range(s, event.range.end)
          var percentage = r.valueOf() / totalRange.valueOf() * 100
          event.percentage = (100 - percentage) + '%'
          var obj = {
            percentage: (percentage) + '%',
            style: {
              left: (((moment(s).hours() - self.dayStart.h) * BASE_SIZE * self.zoom + (moment(s).minutes()) * BASE_SIZE * self.zoom / 60) + 2) +  'px',
              width: self.zoom * self.SLIDER_WIDTH * (r.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px',
              top: event.style.top,
              height: event.style.height,
              totalWidth: self.zoom * self.SLIDER_WIDTH * (totalRange.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px',
              'text-align': 'center',
              color: '#fff',
              'background' : 'repeating-linear-gradient(45deg, ' +  event['background-color']  + ', ' +  event['background-color']  + ' 10px, white 10px, white 20px)',
              'border-top': '1px lightgrey solid',
              'border-bottom': '1px lightgrey solid',
              'border-left': '1px lightgrey solid'
            },
            tooltip: 'Trajet estimé de ' + event.pre + ' min'
          }
          if (percentage > 0) {
            self.preEvent[event.id] = obj
          } else {
            event.pre = 0
          }

        }
        generatePostEvent(event)
        if (event.pauses) {
          event.style['background-image'] = PauseService.generateGradient(event, 'to right')
          event.style['background-color'] = undefined
        }
        const pre = self.preEvent[event.id]
        const post = self.postEvent[event.id]
        event.style.totalWidth = (safeParse(event.style.width) + safeParse(_.get(pre, 'style.width')) + safeParse(_.get(post, 'style.width')) + 1) + 'px'
        currentId++
      })
      if (self.pauses) {
        createBreaks()
      }

    }

    function calcWidth (zoom) {
      return (parseInt(zoom) * BASE_SIZE) + 'px'
    }

    function createBreaks () {
      self.breaks = _.compact(_.map(self.pauses.breaks, function (p) {
        var pause = {
          name: p.name,
          start: moment().hours(p.start.split(':')[0]).minute(p.start.split(':')[1]).second(0),
          end: moment().hours(p.end.split(':')[0]).minute(p.end.split(':')[1]).second(0),
          style: {}
        }

        if (pause.start.isAfter(self.dayEnd) || pause.end.isBefore(self.dayStart)) {
          return
        }
        if (pause.start.isBefore(self.dayStart)) {
          pause.start = moment(angular.copy(self.dayStart))
        }

        if (pause.end.isAfter(self.dayEnd)) {
          pause.end = moment(angular.copy(self.dayEnd))
        }
        pause.style.left = (pause.start.hours() - self.dayStart.h) * BASE_SIZE * self.zoom + pause.start.minutes() * BASE_SIZE * self.zoom / 60 + 'px'
        pause.style.width = self.zoom * self.SLIDER_WIDTH * (moment.range(pause.start, pause.end).valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px'

        return pause
      }))
    }

    function checkAbsence (date) {
      if(self.mode === 'week') {
        return false
      }
      var d = moment(angular.copy(date))
      return _.any(self._absences, function (abs) {
        return abs.range.contains(d)
      })
    }

    function checkFerie (date) {
      return self.holidays.find(holiday => moment(holiday.date).format('L') === moment(date).format('L'));
    }

    function generatePostEvent (event) {
      if (!event.post) {
        return null
      }
      event.style['border-right'] = 'none'
      let end = moment(event.end).add(event.post, 'minutes')
      if (!moment(end).isSame(event.end, 'day')) {
        end = moment(event.end).endOf('day')
      }
      const start = moment(event.end)
      const range = moment.range(start, end)
      const totalRange = moment.range(event.range.start, event.range.end)
      const percentage = range.valueOf() / totalRange.valueOf() * 100
      event.postPercentage = (100 - percentage) + '%'
      var obj = {
        percentage: (percentage) + '%',
        style: {
          left: (((moment(start).hours() - self.dayStart.h) * BASE_SIZE * self.zoom + (moment(start).minutes()) * BASE_SIZE * self.zoom / 60) + 2) +  'px',
          width: self.zoom * self.SLIDER_WIDTH * (range.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px',
          top: event.style.top,
          height: event.style.height,
          totalWidth: self.zoom * self.SLIDER_WIDTH * (totalRange.valueOf()) / self.SECONDS_BY_DAY / 1000 + 'px',
          'text-align': 'center',
          color: '#fff',
          'background' : 'repeating-linear-gradient(135deg, ' +  event['background-color']  + ', ' +  event['background-color']  + ' 10px, white 10px, white 20px)',
          'border-top': '1px lightgrey solid',
          'border-bottom': '1px lightgrey solid',
          'border-left': '1px lightgrey solid'
        },
        tooltip: 'Trajet retour de ' + event.post + ' min'
      }
      if (percentage > 0) {
        self.postEvent[event.id] = obj
      } else {
        event.post = 0
      }
    }

    function safeParse (width = '0px') {
      return parseInt(width.replace('px', ''))
    }
  }

  function PlanningLineDirective () {
    return {
      restrict: 'E',
      templateUrl: '/directives/planning-line/planning-line.html',
      controller: PlanningLineController,
      controllerAs: 'line',
      bindToController: {
        zoom: '=',
        dayStart: '=',
        dayEnd: '=',
        events: '=',
        clickCallback: '&',
        dropCallback: '&',
        pauses: '=?',
        absences: '=?',
        position: '=?',
        mode: '=?',
        entities:'=?',
        dayOfWeek:'=',
        holidays: '='
      },
      scope: true
    }
  }
})(window.angular, window._, window.moment)
