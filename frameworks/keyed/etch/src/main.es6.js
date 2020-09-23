'use strict';

const {Main} = require('./Main');
const component = new Main({});
document.getElementById('main').appendChild(component.element);
