'use strict';
/** @jsx m */
var m = require('mithril')
//controller
var Controller = require('./controller');

//initialize
m.mount(document.getElementById("main"), Controller);