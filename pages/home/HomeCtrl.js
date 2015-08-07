/**
 */

'use strict';

moment.locale('fr');

angular.module('myApp').controller('HomeCtrl', ['$scope', function ($scope) {
    $scope.moment = moment().add(1, 'day');
    $scope.onPikadaySelect = function (pikaday) {
        $scope.moment = pikaday.getMoment();
    };

    var technicians = ['titi', 'toto', 'tutu'];
    $scope.events   = [];
    _.times(30, function (i) {
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
            $scope.events.push(evt3);
            $scope.events.push(angular.copy(evt3));
        }

    });
    $scope.callback = function (a) {
        alert('Event clicked: ' + JSON.stringify(a));
    };

    $scope.dayCallback = function (d) {
        console.info('day callback: ', d);
        $scope.moment= d;
        $scope.mode='day'
    };

    $scope.clickCallback = function(m){
        console.info(m);
    }


}]);