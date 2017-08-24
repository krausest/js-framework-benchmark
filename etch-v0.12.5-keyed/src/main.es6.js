'use strict';

let {Main} = require('./Main');
let component = new Main({});
document.getElementById('main').appendChild(component.element);
