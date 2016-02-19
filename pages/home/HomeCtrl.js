/**
 */

'use strict';

moment.locale('fr');

angular.module('myApp').controller('HomeCtrl', ['$scope', function ($scope) {
    $scope.moment = moment().add(1, 'day');
    $scope.onPikadaySelect = function (pikaday) {
        $scope.moment = pikaday.getMoment();
    };

    $scope.zoom = 10;
    $scope.start = 8;
    $scope.end = 19;
    var technicians = ['titi', 'toto', 'tutu'];
    $scope.events   = [
        {title: 'acoucou', technician: 'atoto', tooltip: 'I Have a tooltip', start: moment().hours(8).minutes(15), end: moment().hours(19).minutes(0)},
        {title: 'acoucou', technician: 'atoto', tooltip: 'I Have a tooltip', start: moment().hours(8).minutes(15), end: moment().hours(19).minutes(0)},
        {title: 'acoucou', technician: 'atoto', tooltip: 'I Have a tooltip', start: moment().hours(8).minutes(15), end: moment().hours(19).minutes(50)},
        {title: 'bcoucou', technician: 'btoto', tooltip: 'I Have a tooltip', start: moment().hours(10).minutes(30), end: moment().hours(12).minutes(45)},
        {title: 'ccoucou', technician: 'ctoto', tooltip: 'I Have a tooltip', start: moment().hours(11).minutes(30), end: moment().hours(13).minutes(45)},
        {title: 'dcoucou', technician: 'dtoto', tooltip: 'I Have a tooltip', start: moment().hours(14).minutes(15), end: moment().hours(16).minutes(45)},
        {title: 'ecoucou', technician: 'etoto', tooltip: 'I Have a tooltip', start: moment().hours(15).minutes(15), end: moment().hours(17).minutes(45)},
        {title: 'ecoucou', technician: 'etoto', tooltip: 'I Have a tooltip', start: moment().hours(14).minutes(15), end: moment().hours(15).minutes(45)},
        {title: 'ecoucou', technician: 'etoto', tooltip: 'I Have a tooltip', start: moment().hours(15).minutes(15), end: moment().hours(15).minutes(45)}
    ];

  /*  _.times(30, function (i) {
        var evt         = {title: i};
        var evt2        = {title: i + 'bis'};
        var evt3        = {title: i + 'ter. Oh boy, this title is long'};
        evt.technician  = technicians[Math.floor(Math.random() * 3)];
        evt.tooltip     = 'I Have a tooltip '+ i;
        evt2.technician = technicians[Math.floor(Math.random() * 3)];
        evt3.technician = technicians[Math.floor(Math.random() * 3)];
        evt.start       = moment();
        evt.start.weekday(i % 7);
        evt.start.hour(i);
        evt2.start      = moment(evt.start);
        evt3.start      = moment(evt.start);
        evt2.start.add(30, 'minutes');
        evt3.start.add(65, 'minutes');

        evt.end  = moment();
        evt.end.weekday(i % 7);
        evt.end.hour(i + 2);
        evt2.end = moment(evt.end);
        evt3.end = moment(evt.end);
        evt2.end.add(30, 'minutes');
        evt3.end.add(65, 'minutes');

        evt['background-color']  = 'rgb(101,108,126)';
        evt['color']             = 'rgb(246,213,36)';
        evt2['color']            = 'rgb(70,189,234)';
        evt2['background-color'] = 'rgb(200,200,200)';


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
        $scope.moment= d;
        $scope.mode='day'
    };

    $scope.clickCallback = function(m){
        console.info('m', m);
    }


}]);
