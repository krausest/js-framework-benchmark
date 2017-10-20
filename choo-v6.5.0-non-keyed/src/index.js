const choo = require('choo');
const html = require('choo/html');
const app = choo();

const rowsView = require('./rowsView');
const store = require('./store');
const utils = require('./utils');
const startMeasure = utils.startMeasure;
const stopMeasure = utils.stopMeasure;

app.use(store);
app.emitter.addListener('render', () => {
  stopMeasure();
});

function view(state, emit) {
  return html`
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Choo v6.5.0</h1>
          </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="run" onclick=${run}>Create 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="runlots" onclick=${runLots}>Create 10,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="add" onclick=${add}>Append 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="update" onclick=${update}>Update every 10th row</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="clear" onclick=${clear}>Clear</button>
            </div>
            <div class="col-sm-6 smallpad">
               <button type="button" class="btn btn-primary btn-block" id="swaprows" onclick=${swapRows}>Swap Rows</button>
            </div>
          </div>
        </div>
      </div>
     </div>
     <table class="table table-hover table-striped test-data">
       <tbody>
         ${rowsView(state, emit)}
       </tbody>
     </table>
     <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  `;

  function run() {
    startMeasure('run');
    emit('run');
  }

  function runLots() {
    startMeasure('runLots');
    emit('runLots');
  }

  function add() {
    startMeasure('add');
    emit('add');
  }

  function update() {
    startMeasure('update');
    emit('update');
  }

  function clear() {
    startMeasure('clear');
    emit('clear');
  }

  function swapRows() {
    startMeasure('swapRows');
    emit('swapRows');
  }
}

app.route('/', view);
app.route('/:chooversion', view);
app.route('/:chooversion/index.html', view);
app.mount('#main');
