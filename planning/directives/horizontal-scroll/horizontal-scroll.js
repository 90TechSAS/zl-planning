/**
 * @author Toolito <toolito@90tech.fr>
 * @copyright 2015 Zenlabs SAS. All rights reserved.
 *
 * TODO Export in separate module ?
 */
(function () {

    'use strict';

    angular
        .module('90Tech.planning')
        .directive('zlHorizontalScroll', ScrollHorizontalDirective);


    ScrollHorizontalDirective.$inject = ['$timeout'];

    function ScrollHorizontalDirective($timeout) {

        return {
            restrict: 'A',
            scope   : {
                scrollLeft: '='
            },
            link    : function link(scope, element, attributes) {

                element.bind('mousewheel', function (e) {
                    element[0].scrollLeft -= e.wheelDelta / 3;
                });
                element.addClass('slider');

                if (scope.scrollLeft) {
                }

                $timeout(function () {
                    //Needs a delay since the offsetWidth we obtain first is off by ~300px
                    element[0].scrollLeft = scope.scrollLeft - element[0].offsetWidth / 2;

                }, 100);
            }
        };


    }


})();
