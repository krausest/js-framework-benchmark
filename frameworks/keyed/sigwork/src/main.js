import Sigwork, { h } from 'sigwork';
window.h = h;

import App from './App.jsx';
Sigwork(document.getElementById('app'), App);