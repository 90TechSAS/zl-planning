;(function (angular, moment) {
  'use strict'

  moment.locale('fr')

  angular.module('myApp').controller('HomeCtrl', [ '$scope', function ($scope) {
    $scope.viewMonth = 1
    $scope.nbEvents = 10
    $scope.onPikadaySelect = function (pikaday) {
      $scope.moment = pikaday.getMoment()
    }
    $scope.moment = moment().month($scope.viewMonth)
    $scope.mode = 'week'

    $scope.zoom = 10
    $scope.start = 8
    $scope.end = 19
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
      $scope.events = []
      //if ($scope.mode === 'month') {
        var month = moment().month($scope.viewMonth)
        $scope.onPikadaySelect = function (pikaday) {
          $scope.moment = pikaday.getMoment()
        }
        $scope.moment = moment().month($scope.viewMonth)

        for (var i = 0; i < $scope.nbEvents; i++) {
          var start = angular.copy(month).date(Math.random() * (month.daysInMonth() - 1) + 1)
          var end = angular.copy(month).date(Math.random() * (month.daysInMonth() - 1) + 1)
          $scope.events.push({
            title: generateRandomText(),
            start: start,
            end: end,
            technician: technicians[ Math.floor(Math.random() * 3) ]
          })
        }
        for (i = 0; i < $scope.nbEvents * 2; i++) {
          var date = angular.copy(month).date(Math.random() * (month.daysInMonth() - 1) + 1)
          $scope.events.push({
            title: generateRandomText() + ' - ' + i,
            start: date,
            end: date,
            technician: technicians[ Math.floor(Math.random() * 3) ]
          })
        }
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
        $scope.events[i]['background-color'] = 'rgb(200,250,200)'
      }
    }

    $scope.init()

    $scope.callback = function (a) {
      console.log('a', a)
      window.alert('Event clicked: ' + JSON.stringify(a))
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
      if ($scope.mode === 'month') {
        $scope.mode = 'week'
      } else if ($scope.mode === 'week') {
        $scope.mode = 'day'
      } else if ($scope.mode === 'day') {
        $scope.mode = 'month'
      }
      $scope.init()
    }
  }])
}(window.angular, window.moment))
