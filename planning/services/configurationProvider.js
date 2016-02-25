;(function (angular) {
  'use strict'
  angular.module('90Tech.planning')
    .provider('planningConfiguration', function () {
      var self = this

      self.BASE_SIZE = 10
      self.MAX_PARALLEL = 3
      self.strings = {
        nothing_to_show: 'Rien à afficher'
      }

      self.parallelText = 'parallel items'

      this.setParallelText = function (text) {
        self.parallelText = '' + text
      }

      this.setBaseSize = function (size) {
        self.BASE_SIZE = size
      }
      this.setMaxParallel = function (number) {
        self.MAX_PARALLEL = number
      }

      this.setString = function (key, value) {
        self.strings[key] = value
      }

      this.$get = [function () {
        return {strings: self.strings, BASE_SIZE: self.BASE_SIZE, MAX_PARALLEL: self.MAX_PARALLEL, parallelText: self.parallelText}
      }]
    })
}(window.angular))
