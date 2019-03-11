;(function () {
  'use strict'

  faker.seed(1)

  const ENTITIES = [
    faker.name.firstName() + ' ' + faker.name.lastName(),
    faker.name.firstName() + ' ' + faker.name.lastName(),
    faker.name.firstName() + ' ' + faker.name.lastName(),
    faker.name.firstName() + ' ' + faker.name.lastName(),
    faker.name.firstName() + ' ' + faker.name.lastName()
  ]

  const MODES = ['month', 'week', 'week-advanced', 'day']

  class MainController {
    constructor (planningConfiguration) {
      this.conf = planningConfiguration
      this.conf.absentTechnicianCallback = (callback) => {
        if (confirm('ABSENT')) {
          callback()
        }
      }
      this.entities = ENTITIES
      this.viewMonth = moment().month()
      this.nbEvents = 10
      this.moment = moment()
      this.mode = 'week-advanced'
      this.zoom = 10
      this.start = 0
      this.end = 23
      this.absences = {}
      this.events = []
      this.days = [0, 1, 2, 3, 4, 5, 6]
      this.hideAbsences = true
    }

    $onInit () {
      this.generate()
    }

    generateAbsences () {
      if (this.hideAbsences) {
        this.absences = []
        return
      }
      const start = moment(new Date()).startOf('week').toDate()
      const end = moment(new Date()).endOf('week').toDate()

      this.absences = this.entities.reduce((acc, entity) => {
        const totalAbsences = Math.floor(Math.random() * (0 - 10 + 1)) + 10
        const absences = []
        _.times(totalAbsences, () => {
          const date1 = faker.date.between(start, end)
          const date2 = faker.date.between(start, end)
          absences.push({
            start: moment.min(moment(date1), moment(date2)).toDate(),
            end: moment.max(moment(date1), moment(date2)).toDate(),
            type: 'planned',
            comment: 'Congés',
          })
        })
        acc[entity] = absences
        return acc
      }, {})
    }

    generate() {
      this.generateAbsences()
      this.generateEvents()
    }

    generateEvents () {
      if (window.location.href.includes('localhost') && false) {
        return this.testUsecase()
      }
      this.events = []
      const month = moment().month(this.viewMonth)
      for (let i = 0; i < this.nbEvents; i++) {
        const d = Math.ceil(Math.random() * 32) - 1
        const dd = Math.ceil(Math.random() * 32) - 1
        let start
        let end
        switch (this.mode) {
          case '3day':
            start = moment(this.moment).hour(Math.ceil(Math.random() * 24)).minutes(Math.ceil(Math.random() * 60))
            start.add(Math.floor(Math.random() * 2), 'day')
            end = moment(angular.copy(start)).hour(Math.ceil(Math.random() * 24)).minutes(Math.ceil(Math.random() * 60))
            end.add(Math.floor(Math.random() * 5), 'day')
            break
          case 'day':
            var roundValueAt = 30
            start = moment(this.moment).hour(Math.ceil(Math.random() * 24)).minutes(Math.ceil(Math.ceil(Math.random() * 60) / roundValueAt) * roundValueAt)
            end = moment(this.moment).hour(Math.ceil(Math.random() * 24)).minutes(Math.ceil(Math.ceil(Math.random() * 60) / roundValueAt) * roundValueAt)
            if (start.isAfter(end)) {
              var copy = angular.copy(start)
              start = angular.copy(end)
              end = copy
            }
            break
          default:
            start = moment(month).date(d).hour(Math.ceil(Math.random() * 24)).minutes(Math.ceil(Math.random() * 60))
            end = moment(month).date(dd).hour(Math.ceil(Math.random() * 24)).minutes(Math.ceil(Math.random() * 60))
            break
        }
        this.events.push({
          title: faker.random.words(),
          start: start,
          end: end,
          tooltip: faker.random.words(),
          tooltipTemplate: i % 2 !== 0 ? '\'/templates/test-template.html\'' : undefined,
          technician: this.entities[Math.floor(Math.random() * this.entities.length)],
          color: faker.internet.color(),
          'background-color': faker.internet.color()/*,
          pre: Math.ceil(Math.random()*240)*/
        })
      }
    }

    testUsecase () {

      const start = moment().hours(9).minutes(30)
      const end = moment(start).add(1, 'day')
      end.hours(17)
      this.events = [
        {
          title: faker.random.words(),
          start: start,
          end: end,
          tooltip: faker.random.words(),
          technician: 'Axel Cousin',
          color: faker.internet.color(),
          'background-color': '#799aff',
          /*,
          pre: Math.ceil(Math.random()*240)*/
        }
      ]
    }

    onPikadaySelect (pikaday) {
      this.moment = pikaday.getMoment()
      this.generate()
    }

    callback (event) {
      console.log({event})
      window.alert(`
Event clicked:
start: ${event.start.format('HH:mm')}
end: ${event.end.format('HH:mm')}
${JSON.stringify(event)}
      `)
    }

    dayCallback (day) {
      console.log({day})
      this.moment = day
      this.mode = 'day'
    }

    clickCallback (click) {
      console.log({click})
    }

    hello (event) {
      console.groupCollapsed('Hello')
      console.log({event})
      console.groupEnd()
    }

    switch () {
      this.mode = MODES[(MODES.indexOf(this.mode) + 1) % MODES.length]
      console.log(`Switched to mode ${this.mode}`)
    }

    setMode (mode) {
      this.mode = mode
    }

    toggleDay (day) {
      const days = [...this.days]
      if (days.includes(day)) {
        days.splice(days.indexOf(day), 1)
      } else {
        days.push(day)
      }
      this.days = days.sort()
    }

    action (event) {
      console.log({action: event})
    }
  }

  angular.module('myApp')
    .component('appMain', {
      templateUrl: `/components/main.component.html`,
      controller: ['planningConfiguration', MainController]
    })

})()

