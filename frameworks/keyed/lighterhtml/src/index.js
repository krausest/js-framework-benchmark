import {State} from 'js-framework-benchmark-utils';
import {html, render} from 'lighterhtml';

import Jumbotron from './jumbotron.js';
import Table from './table.js';

const state = State(update);
const main = document.getElementById('container');

update(state);

function update(state) {
  render(main, html`
  <div class="container">
    ${Jumbotron(state)}
    ${Table(state)}
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
  </div>`);
}
