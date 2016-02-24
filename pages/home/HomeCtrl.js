/**
 */

'use strict';

moment.locale('fr');

angular.module('myApp').controller('HomeCtrl', [ '$scope', function ($scope) {
  $scope.viewMonth = 1
  $scope.nbEvents = 10
  var month = moment().month($scope.viewMonth)
  $scope.onPikadaySelect = function (pikaday) {
    $scope.moment = pikaday.getMoment();
  };
  $scope.moment = moment().month($scope.viewMonth);
  $scope.mode = 'month'

  $scope.zoom = 10;
  $scope.start = 8;
  $scope.end = 19;
  var technicians = [ 'titi', 'toto', 'tutu' ];
  $scope.events = [];


  function generateRandomText()
  {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 5; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

  $scope.init = function() {
    delete $scope.events
    $scope.events = []

    var month = moment().month($scope.viewMonth)
    $scope.onPikadaySelect = function (pikaday) {
      $scope.moment = pikaday.getMoment();
    };
    $scope.moment = moment().month($scope.viewMonth);

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
    for (var i = 0; i < $scope.nbEvents; i++) {
      var date = angular.copy(month).date(Math.random() * (month.daysInMonth() - 1) + 1)
      $scope.events.push({
        title: generateRandomText() + ' - ' + i,
        start: date,
        end: date,
        technician: technicians[ Math.floor(Math.random() * 3) ]
      })
    }

    /*$scope.events.push({
      title: moment().month($scope.viewMonth).date(10).format('dddd DD MMMM'),
      start: moment().month($scope.viewMonth).date(10),
      end: moment().month($scope.viewMonth).date(15)
    })

    $scope.events.push({
      title: moment().month($scope.viewMonth).date(1).format('dddd DD MMMM'),
      start: moment().month($scope.viewMonth).date(1),
      end: moment().month($scope.viewMonth).date(3)
    })
    console.log(moment().month($scope.viewMonth).date(1).format('dddd DD MMMM'))

    $scope.events.push({
      title: moment().month($scope.viewMonth).date(4).format('dddd DD MMMM'),
      start: moment().month($scope.viewMonth).date(4),
      end: moment().month($scope.viewMonth).date(9)
    })

    $scope.events.push({
      title: moment().month($scope.viewMonth).date(22).format('dddd DD MMMM'),
      start: moment().month($scope.viewMonth).date(22),
      end: moment().month($scope.viewMonth).date(31)
    }) */


    for (var i = 0; i < $scope.events.length; i++) {
      var red = Math.floor(Math.random() * (255 - 0 + 1))
      var green = Math.floor(Math.random() * (255 - 0 + 1))
      var blue = Math.floor(Math.random() * (255 - 0 + 1))
      $scope.events[i]['background-color'] = 'rgb('+red+','+green+','+blue+')'
      $scope.events[i]['color'] = 'rgb('+blue+','+red+','+green+')'
    }
  }

  $scope.init()



/*
  _.times(30, function (i) {
    var evt = { title: i };
    var evt2 = { title: i + 'bis' };
    var evt3 = { title: i + 'ter. Oh boy, this title is long' };
    evt.technician = technicians[ Math.floor(Math.random() * 3) ];
    evt.tooltip = 'I Have a tooltip ' + i;
    evt2.technician = technicians[ Math.floor(Math.random() * 3) ];
    evt3.technician = technicians[ Math.floor(Math.random() * 3) ];
    evt.start = moment();
    evt.start.date(i);
    evt.start.hour(i);
    evt2.start = moment(evt.start);
    evt3.start = moment(evt.start);
    evt2.start.add(30, 'minutes');
    evt3.start.add(65, 'minutes');

    evt.end = moment();
    evt.end.date(i + Math.floor(Math.random()*5));
    evt.end.hour(i + 2);
    evt2.end = moment(evt.end);
    evt3.end = moment(evt.end);
    evt2.end.add(30, 'minutes');
    evt3.end.add(65, 'minutes');

    evt[ 'background-color' ] = 'rgb(101,108,126)';
    evt[ 'color' ] = 'rgb(246,213,36)';
    evt2[ 'color' ] = 'rgb(70,189,234)';
    evt2[ 'background-color' ] = 'rgb(200,200,200)';
  if (evt.start.isBefore(evt.end)) {
      $scope.events.push(evt);
    }
    if (i % 2 && evt2.start.isBefore(evt2.end)) {
      $scope.events.push(evt2);
    }
    if (evt3.start.isBefore(evt3.end)) {
      //          $scope.events.push(evt3);
      //          $scope.events.push(angular.copy(evt3));
    }

    });    */
    $scope.callback = function (a) {
        console.log('a', a);
        alert('Event clicked: ' + JSON.stringify(a));
    };

  $scope.dayCallback = function (d) {
    console.info('day callback: ', d);
    $scope.moment = d;
    $scope.mode = 'day'
  };

    $scope.clickCallback = function(m){
        console.info('m', m);
    }

  $scope.switch = function() {
    if ($scope.mode === 'month') {
      $scope.mode = 'week'
    } else if ($scope.mode === 'week') {
      $scope.mode = 'day'
    } else if ($scope.mode === 'day') {
      $scope.mode = 'month'
    }
  }

}]);
