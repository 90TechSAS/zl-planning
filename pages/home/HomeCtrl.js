/**
 */

'use strict';

moment.locale('fr');

angular.module('myApp').controller('HomeCtrl', ['$scope', function ($scope) {
    $scope.moment = moment();

    $scope.events = [];
    _.times(24, function (i) {
        var evt    = {title: i};
        var evt2   = {title: i + 'bis'};
        var evt3   = {title: i + 'ter'};
        evt.start  = moment();
        evt.start.day(i % 7);
        evt.start.hour(i);
        evt2.start = moment(evt.start);
        evt3.start = moment(evt.start);
        evt2.start.add(30, 'minutes');
        evt3.start.add(65, 'minutes');

        evt.end  = moment();
        evt.end.day(i % 7);
        evt.end.hour(i + 1);
        evt2.end = moment(evt.end);
        evt3.end = moment(evt.end);
        evt2.end.add(30, 'minutes');
        evt3.end.add(65, 'minutes');

        evt['background-color']  = 'rgb(101,108,126)';
        evt['color']             = 'rgb(246,213,36)';
        evt2['color']            = 'rgb(70,189,234)';
        evt2['background-color'] = 'rgb(200,200,200)';


        $scope.events.push(evt);
        if (i % 2) {
            $scope.events.push(evt2);
        }
        $scope.events.push(evt3);
        $scope.events.push(angular.copy(evt3));

        $scope.callback = function(a){
           alert('Event clicked: ' + a.title);
        }
    });

}]);