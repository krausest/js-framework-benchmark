'use strict';

require('babel-core/lib/babel/polyfill');

const angular = require('./angularmin');
const HomeController = require('HomeController');

console.log("angular", angular);

angular.module('app', [])
    .controller('HomeController',HomeController);