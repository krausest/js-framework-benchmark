'use strict';

let React = require('react');
let ReactDOM = require('react-dom');
let { VueInReact } = require('vuera');
let App = require('./App.vue').default;

const Component = VueInReact(App);

ReactDOM.render(React.createElement(Component, {}), document.getElementById('main'));