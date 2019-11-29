import {State} from 'js-framework-benchmark-utils';
import {bind} from 'hyperhtml';

import Row from './row.js';

const state = State(update);
const html = bind(document.getElementById('main'));

const click = ({target}) => {
  const a = target.closest('a');
  const {action} = a.dataset;
  state[action](+a.closest('tr').id);
};

update(state);

function update({data, selected, run, runLots, add, update, clear, swapRows}) {
  html`
  <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>hyper(HTML) keyed</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block"
                      id="run" onclick=${run}>Create 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block"
                      id="runlots" onclick=${runLots}>Create 10,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block"
                      id="add" onclick=${add}>Append 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block"
                      id="update" onclick=${update}>Update every 10th row</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block"
                      id="clear" onclick=${clear}>Clear</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block"
                      id="swaprows" onclick=${swapRows}>Swap Rows</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table onclick=${click} class="table table-hover table-striped test-data">
      <tbody>${data.map(item => Row(data, selected, item))}</tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>`;
}
