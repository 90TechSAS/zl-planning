;(function (angular, moment, faker) {
  'use strict'

  moment.locale('fr')

  angular.module('myApp').controller('HomeCtrl', ['$scope', 'planningConfiguration', function ($scope, planningConfiguration) {
    $scope.viewMonth = moment().month()
    $scope.nbEvents = 10
    $scope.conf = planningConfiguration
    $scope.onPikadaySelect = function (pikaday) {
      $scope.moment = pikaday.getMoment()
    }
    $scope.moment = moment().month($scope.viewMonth)
    $scope.mode = 'day'

    $scope.zoom = 10
    $scope.start = 0
    $scope.end = 23
    /*$scope.entitiesPauses = {
      'titi': {
        '_id': '1',
        'name': 'titi',
        'breaks': [{'start': '00:00', 'end': '06:00', 'name': 'REPOS'}, {
          'start': '19:00',
          'end': '23:59',
          'name': 'REPOS'
        }, {'start': '12:00', 'end': '13:00', 'name': 'Déjeuner'}]
      },
      'toto': {
        '_id': '2',
        'name': 'toto',
        'breaks': [{'start': '00:00', 'end': '08:00', 'name': 'REPOS'}, {
          'start': '18:00',
          'end': '23:59',
          'name': 'REPOS'
        }, {'start': '12:15', 'end': '13:45', 'name': 'Pause repas plus courte'}]
      }
    }*/
    var technicians = ['titi', 'toto', 'tutu']
    $scope.events = []

    $scope.init = function () {
      delete $scope.events
      $scope.days = [0, 1, 2, 5 , 7] /*_.clone(planningConfiguration.DAYS)*/
      $scope.events = []
      var month = moment().month($scope.viewMonth)
      $scope.onPikadaySelect = function (pikaday) {
        $scope.moment = pikaday.getMoment()
      }
      $scope.moment = moment().month($scope.viewMonth)

      for (var i = 0; i < $scope.nbEvents; i++) {
        var d = Math.ceil(Math.random() * 32) - 1
        var dd = Math.ceil(Math.random() * 32) - 1
        var start
        var end
        switch ($scope.mode) {
          case '3day':
            start = moment().hour(Math.ceil(Math.random() * 24)).minutes(Math.ceil(Math.random() * 60))
            start.add(Math.floor(Math.random() * 2), 'day')
            end = moment(angular.copy(start)).hour(Math.ceil(Math.random() * 24)).minutes(Math.ceil(Math.random() * 60))
            end.add(Math.floor(Math.random() * 5), 'day')
            break
          case 'day':
            var roundValueAt = 30
            start = moment().hour(Math.ceil(Math.random() * 24)).minutes(Math.ceil(Math.ceil(Math.random() * 60)/roundValueAt)*roundValueAt)
            end = moment().hour(Math.ceil(Math.random() * 24)).minutes(Math.ceil(Math.ceil(Math.random() * 60)/roundValueAt)*roundValueAt)
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
        $scope.events.push({
          title: faker.random.words(),
          start: start,
          end: end,
          tooltip: faker.random.words(),
          tooltipTemplate: i % 2 !== 0 ? "'/pages/home/test-template.html'" : undefined,
          technician: technicians[Math.floor(Math.random() * 3)]/*,
          pre: Math.ceil(Math.random()*240)*/
        })
      }

      for (i = 0; i < $scope.events.length; i++) {
        $scope.events[i].color = faker.internet.color()
        $scope.events[i]['background-color'] = faker.internet.color()
      }

      console.groupCollapsed('Generated events')
      console.table(_.map($scope.events, function (e) {
        return {title: e.title, start: e.start.format('DD/MM/YYYY HH:mm'), end: e.end.format('DD/MM/YYYY HH:mm'), technician: e.technician}
      }))
      console.groupEnd()

    }

    $scope.init()

    $scope.callback = function (a) {
      console.log('a', a)
      window.alert('Event clicked: ' +
        '\nstart: ' + a.start.format('HH:mm') +
        '\nend: ' + a.end.format('HH:mm') +
        '\n' + JSON.stringify(a))
    }

    $scope.dayCallback = function (d) {
      console.info('day callback: ', d)
      $scope.moment = d
      $scope.mode = 'day'
    }

    $scope.clickCallback = function (m) {
      console.info('m', m)
    }

    $scope.hello = function (event) {
      console.log(event)
    }

    $scope.drop = function ($data, $event, $moment, $entity) {
      console.log($data)
      console.log($moment)
      console.log($entity)
    }

    $scope.switch = function () {
      var modes = ['month', 'week', 'week-advanced', 'day']
      $scope.mode = modes[(modes.indexOf($scope.mode) + 1) % modes.length]
      console.log('Switching to mode : ' + $scope.mode)
      $scope.init()
    }

    $scope.setMode = function (mode) {
      $scope.mode = mode
    }

    $scope.toggleDay = function (day) {
      var days = _.clone($scope.days)
      if (_.include(days, day)) {
        days.splice(days.indexOf(day), 1)
      } else {
        days.push(day)
      }
      days = days.sort()
      $scope.days = days
    }

    $scope.action = function (event) {
      console.log(event)
    }
  }])
}(window.angular, window.moment, window.faker))
