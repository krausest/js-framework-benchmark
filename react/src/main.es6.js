'use strict';

let React = require('react');
let ReactDOM = require('react-dom');
let {Main} = require('./Main');

console.log("Main", Main);

ReactDOM.render(React.createElement(Main, {}), document.getElementById('main'));