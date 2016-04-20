'use strict';

require('babel-core/lib/babel/polyfill');
var jQuery = require("jquery");

const angular = require('./angularmin');
const HomeController = require('HomeController');

angular.module('app', [])
    .controller('HomeController',HomeController);