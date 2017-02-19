const store = require('./store');
const rowsView = require('./rowsView');
const choo = require('choo');
const html = require('choo/html');
const app = choo();

app.model(store);

let startTime;
let lastMeasure;
function startMeasure(name) {
  startTime = performance.now();
  lastMeasure = name;
};

function stopMeasure() {
  const last = lastMeasure;
  if (lastMeasure) {
    window.setTimeout(function metaStopMeasure() {
      lastMeasure = null;
      const stop = performance.now();
      const duration = 0;
      console.log(last+" took "+(stop-startTime));
    }, 0);
  }
};

function view (state, prev, send) {
  function run() {
    startMeasure('run');
    send('run');
  }

  function runLots() {
    startMeasure('runLots');
    send('runLots');
  }

  function add() {
    startMeasure('add');
    send('add');
  }

  function update() {
    startMeasure('update');
    send('update');
  }

  function clear() {
    startMeasure('clear');
    send('clear');
  }

  function swapRows() {
    startMeasure('swapRows');
    send('swapRows');
  }

  function printDuration() {
    stopMeasure();
  }

  printDuration();
  
  return html`<div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>Choo v4.1.0</h1>
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
       ${rowsView(state, prev, send)}
     </tbody>
   </table>
   <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>`;
};

app.router([
  ['/', view] 
]);

const tree = app.start();
document.querySelector('#main').appendChild(tree);
