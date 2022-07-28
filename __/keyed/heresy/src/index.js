import {State} from 'js-framework-benchmark-utils';
import {define, html, render} from 'heresy';

import App from './ui/app.js';
define('App', App);

const state = State(update);
const main = document.getElementById('container');

update(state);

function update(state) {
  render(main, html`<App .state=${state} />`);
}
