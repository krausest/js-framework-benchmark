import {State} from 'js-framework-benchmark-utils';
import {html, render} from 'uhtml';

import Jumbotron from './jumbotron.js';
import Table from './table-delegate.js';

const state = State(Table);

render(document.getElementById('container'), html`
  <div class="container">
    ${Jumbotron(state)}
    ${Table(state)}
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
  </div>
`);
