const rowsView = require('./rowsView');
const choo = require('choo');
const html = require('choo/html');
const app = choo();

let id = 1;

function _random(max) {
  return Math.round(Math.random()*1000)%max;
}

function buildData(count) {
  count = count || 1000;
  const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
  const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
  const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

  return new Array(count).fill('').map(() => {
    return {
      id: id++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
    };
  });
}

app.use(function(state, emitter) {
    state.data = [];
    state.selected = false;

    emitter.on('run', function() {
      state.data = buildData(1000);
      state.selected = undefined;
      emitter.emit('render');
    });
    emitter.on('add', function() {
      state.data = state.data.slice().concat(buildData(1000));
      state.selected = undefined;
      emitter.emit('render');
    });
    emitter.on('runLots', function() {
      state.data = state.data.slice().concat(buildData(10000));
      state.selected = undefined;
      emitter.emit('render');
    });
    emitter.on('clear', function() {
      state.data = [];
      state.selected = undefined;
      emitter.emit('render');
    });
    emitter.on('update', function() {
      for (let i=0;i<state.data.length;i+=10) {
          state.data[i].label += ' !!!';
      }
      emitter.emit('render');
    }),
    emitter.on('swapRows', function() {
      if(state.data.length > 10) {
    		var a = state.data[4];
    		state.data[4] = state.data[9];
    		state.data[9] = a;
    	}
      emitter.emit('render');
    }),
    emitter.on('select', function(params) {
      console.log("select", params);
      state.selected = params.id;
      emitter.emit('render');
    });
    emitter.on('delete', function(params) {
      let idx = state.data.findIndex(d => d.id==params.id);
      console.log("delete", params, idx);
      state.data.splice(idx, 1);
      emitter.emit('render');
    });
});

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

function view (state, emit) {
  function run() {
    console.log("run");
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

  function printDuration() {
    stopMeasure();
  }

  printDuration();
  
  return html`<div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>Choo v5.4.0</h1>
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
  </div>`;
};

app.route('/', view) 
app.route('/:chooversion', view) 
app.route('/:chooversion/index.html', view) 
app.mount('#main')
