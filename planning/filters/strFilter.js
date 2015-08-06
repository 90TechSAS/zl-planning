(function(){
    'use strict';
    angular
        .module('90Tech.planning')
        .filter('strPlanning', function(planningConfiguration){
            return function(val){
                return planningConfiguration.strings[val];
            }
        })


})();