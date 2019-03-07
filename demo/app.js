;(function (angular) {
  'use strict'

  angular.module('myApp', [
    'ngRoute', 'ngSanitize', 'ngTouch', 'ngAnimate', // additional angular modules
    'ui.bootstrap', '90Tech.planning'
  ]).config(['$routeProvider', '$locationProvider', '$compileProvider', 'planningConfigurationProvider', function ($routeProvider, $locationProvider, $compileProvider, planningConfigurationProvider) {
    /**
     setup - whitelist, appPath, html5Mode
     @toc 1.
     */
    $locationProvider.html5Mode(false) // can't use this with github pages / if don't have access to the server

    planningConfigurationProvider.setString('nothing_to_show', 'HZJKZHZJKHZJ')
    planningConfigurationProvider.setDays([0,1,3,4,5])
  }])

}(window.angular))
