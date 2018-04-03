;(function (angular, moment) {
  'use strict'

  moment.locale('fr')

  angular.module('myApp').controller('HomeCtrl', [ '$scope', 'planningConfiguration', function ($scope, planningConfiguration) {
    $scope.viewMonth = 1
    $scope.nbEvents = 30
    $scope.conf = planningConfiguration
    $scope.onPikadaySelect = function (pikaday) {
      $scope.moment = pikaday.getMoment()
    }
    $scope.moment = moment().month($scope.viewMonth)
    $scope.mode = 'week'

    $scope.zoom = 10
    $scope.start = 0
    $scope.end = 23
    $scope.entitiesPauses = {
      'titi': {
        "_id":"1",
        "name":"titi",
        "breaks":[{"start":"00:00","end":"06:00","name":"REPOS"},{"start":"19:00","end":"23:59","name":"REPOS"},{"start":"12:00","end":"13:00","name":"Déjeuner"}]
      },
      'toto': {
        "_id":"2",
        "name":"toto",
        "breaks":[{"start":"00:00","end":"08:00","name":"REPOS"},{"start":"18:00","end":"23:59","name":"REPOS"},{"start":"12:15","end":"13:45","name":"Pause repas plus courte"}]}
    }
    var technicians = [ 'titi', 'toto', 'tutu' ]
    $scope.events = []

    function generateRandomText () {
      var text = ''
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      return text
    }

    $scope.init = function () {
      delete $scope.events
      $scope.days = _.clone(planningConfiguration.DAYS)
      $scope.events = []
      //if ($scope.mode === 'month') {
        var month = moment().month($scope.viewMonth)
        $scope.onPikadaySelect = function (pikaday) {
          $scope.moment = pikaday.getMoment()
        }
        $scope.moment = moment().month($scope.viewMonth)

        for (var i = 0; i < $scope.nbEvents; i++) {
          var d = Math.ceil(Math.random()*32)-1
          var dd = Math.ceil(Math.random()*32)-1
          var start = moment(month).date(d).hour(Math.ceil(Math.random()*24)).minutes(Math.ceil(Math.random()*60))
          var end = moment(month).date(dd).hour(Math.ceil(Math.random()*24)).minutes(Math.ceil(Math.random()*60))
          //var start = angular.copy(month).hours(Math.random() * 23).minutes(Math.random()*60)
          ///var end = angular.copy(month).add(Math.random() * 23, 'h') //.hours(Math.random() * 23).minutes(Math.random()*60)
          $scope.events.push({
            title: generateRandomText(),
            start: start,
            end: end,
            technician: technicians[ Math.floor(Math.random() * 3) ]/*,
            pre: Math.ceil(Math.random()*240)*/
          })
        }
     /*   for (i = 0; i < $scope.nbEvents * 2; i++) {
          var date = angular.copy(month).date(Math.random() * (month.daysInMonth() - 1) + 1)
          $scope.events.push({
            title: generateRandomText() + ' - ' + i,
            start: date,
            end: moment(date).add(3, 'h'),
            technician: technicians[ Math.floor(Math.random() * 3) ]
          })
        }*/
      /*} else {
        $scope.events = [
          {title: 'acoucou', technician: 'atoto', tooltip: 'I Have a tooltip', start: moment().hours(8).minutes(15), end: moment().hours(19).minutes(0)},
          {title: 'acoucou', technician: 'atoto', tooltip: 'I Have a tooltip', start: moment().hours(8).minutes(15), end: moment().hours(19).minutes(0)},
          {title: 'acoucou', technician: 'atoto', tooltip: 'I Have a tooltip', start: moment().hours(8).minutes(15), end: moment().hours(19).minutes(50)},
          {title: 'bcoucou', technician: 'btoto', tooltip: 'I Have a tooltip', start: moment().hours(10).minutes(30), end: moment().hours(12).minutes(45)},
          {title: 'ccoucou', technician: 'ctoto', tooltip: 'I Have a tooltip', start: moment().hours(11).minutes(30), end: moment().hours(13).minutes(45)},
          {title: 'dcoucou', technician: 'dtoto', tooltip: 'I Have a tooltip', start: moment().hours(14).minutes(15), end: moment().hours(16).minutes(45)},
          {title: 'ecoucou', technician: 'etoto', tooltip: 'I Have a tooltip', start: moment().hours(15).minutes(15), end: moment().hours(17).minutes(45)},
          {title: 'ecoucou', technician: 'etoto', tooltip: 'I Have a tooltip', start: moment().hours(14).minutes(15), end: moment().hours(15).minutes(45)},
          {title: 'ecoucou', technician: 'etoto', tooltip: 'I Have a tooltip', start: moment().hours(15).minutes(15), end: moment().hours(15).minutes(45)}
        ]
      } */

      for (i = 0; i < $scope.events.length; i++) {
        var red = Math.floor(Math.random() * (255))
        var green = Math.floor(Math.random() * (25))
        var blue = Math.floor(Math.random() * (255))
        $scope.events[i].color = 'rgb(' + blue + ',' + red + ',' + green + ')'
        $scope.events[i]['background-color'] = 'rgb(' + red + ',' + green + ',' + blue + ')'//'rgb(200,250,200)'
      }
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

    $scope.drop = function($data, $event, $moment, $entity){
      console.log($data)
      console.log($moment)
      console.log($entity)
    }

    $scope.switch = function () {
      var modes = [ 'month', 'week', 'week-advanced', 'day']
      $scope.mode = modes[(modes.indexOf($scope.mode)+1) % modes.length ]
      console.log($scope.mode)
      $scope.init()
    }

    $scope.toggleDay = function (day) {
      console.log('aaaaaa')
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
}(window.angular, window.moment))
