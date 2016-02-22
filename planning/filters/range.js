/**
 * WebApp Agenda
 * http://docs.pluginit.fr/agenda
 *
 * Copyright 2014 PluginIT
 * Non permissive commercial License.
 */

(function() {

    'use strict';

    angular
        .module('90Tech.planning')
        .filter('range', RangeFilter);

    /**
     * Class Range for emulate a "for" loop
     * @class RangeFilter
     * @constructor
     */
    function RangeFilter() {

        /**
         * Return decimal values arrays at wished size
         * @param input
         * @param total
         * @returns {*}
         */
        var operation = function(input, total) {

            // We parse just in case
            total = parseInt(total);

            // We're adding at empty array the current value for the loop
            for(var i = 0; i < total; i++) {
                input.push(i);
            }

            // We return the array finally
            return input;

        };



        /**
         * Return callback to execute RangeFilter
         */
        return operation;
    }

})();