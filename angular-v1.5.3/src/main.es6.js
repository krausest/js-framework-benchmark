'use strict';

require('babel-core/lib/babel/polyfill');
var jQuery = require("jquery");

const angular = require('./angularmin');
const HomeController = require('HomeController');

const myApp = angular.module('app', []);

myApp.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);

myApp.controller('HomeController',HomeController);