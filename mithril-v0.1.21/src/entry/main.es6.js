'use strict';
/** @jsx m */
var m = require('mithril')
//controller
var controller = require('./controller');

//initialize
m.module(document.getElementById("main"), controller);