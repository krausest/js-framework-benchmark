'use strict';

let dio = require('dio.js');
let {Main} = require('./Main');

dio.render(<Main />, document.getElementById('main'));
