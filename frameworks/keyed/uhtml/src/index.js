import {State} from 'js-framework-benchmark-utils';
import {html, htmlFor, render} from 'uhtml/keyed';

import Jumbotron from './jumbotron.js';
import Table from './table.js';

const state = State(Table, false, htmlFor);

render(document.getElementById('container'), html`
  <div class="container">
    ${Jumbotron(state)}
    ${Table(state)}
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
  </div>
`);
