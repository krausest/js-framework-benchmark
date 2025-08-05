import { html, render, signal } from 'uhtml';

import Table from './table.js';
import Jumbotron from './jumbotron.js';
import { handle } from './utils.js';

const App = ({ title, data }) => html`
  <div class="container">
    <!-- direct, non reactive, component -->
    ${Jumbotron({ title, data })}
    <!-- reactive component -->
    <${Table} ...${{ data, select: handle('select'), remove: handle('remove') }} />
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
  </div>
`;

render(document.getElementById('container'), App({
  title: 'µhtml non-keyed',
  data: signal([], { greedy: true })
}));
