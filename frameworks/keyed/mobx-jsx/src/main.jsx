import { observable, action, untracked } from 'mobx';
import { r, each, selectWhen, root } from 'mobx-jsx';

function _random (max) {
  return Math.round(Math.random() * 1000) % max;
};

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
    }
  }
  return data;
}

function App() {
  const state = observable({data: [], selected: null});

  const clickRow = (e, id) => {
    e.stopPropagation();
    action(() => {
      if (e.target.matches('.delete')) {
        // startMeasure('remove');
        state.data = state.data.filter(row => row.id !== id);
        // stopMeasure();
      } else {
        // startMeasure("select");
        state.selected = id;
        // stopMeasure();
      }
    })();
  };

  const run = action(e => {
    e.stopPropagation();
    // startMeasure('create 1000');
    state.data = buildData(1000);
    state.selected = null;
    // stopMeasure();
  });

  const runLots = action(e => {
    e.stopPropagation();
    // startMeasure('create 10000');
    state.data = buildData(10000);
    state.selected = null;
    // stopMeasure();
  });

  const add = action(e => {
    e.stopPropagation();
    // startMeasure('append 1000');
    state.data = state.data.concat(buildData(1000));
    // stopMeasure();
  });

  const update = action(e => {
    e.stopPropagation();
    // startMeasure('update');
    let index = 0;
    while (index < state.data.length) {
      state.data[index].label += ' !!!';
      index += 10;
    }
    // stopMeasure();
  });

  const swapRows = action(e => {
    e.stopPropagation();
    // startMeasure("swapRows");
    if (state.data.length > 998) {
      let temp = state.data[1];
      state.data[1] = state.data[998];
      state.data[998] = temp;
    }
    // stopMeasure();
  });

  const clear = action(e => {
    e.stopPropagation();
    // startMeasure('clear');
    state.data = [];
    state.selected = null;
    // stopMeasure();
  });

  return <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class ='col-md-6'><h1>MobX-JSX Keyed</h1></div>
      <div class ='col-md-6'><div class ='row'>
        <div class ='col-sm-6 smallpad'>
          <button id='run' class='btn btn-primary btn-block' type='button' onClick={ run }>Create 1,000 rows</button>
        </div>
        <div class='col-sm-6 smallpad'>
          <button id='runlots' class='btn btn-primary btn-block' type='button' onClick={ runLots }>Create 10,000 rows</button>
        </div>
        <div class='col-sm-6 smallpad'>
          <button id='add' class='btn btn-primary btn-block' type='button' onClick={ add }>Append 1,000 rows</button>
        </div>
        <div class='col-sm-6 smallpad'>
          <button id='update' class='btn btn-primary btn-block' type='button' onClick={ update }>Update every 10th row</button>
        </div>
        <div class='col-sm-6 smallpad'>
          <button id='clear' class='btn btn-primary btn-block' type='button' onClick={ clear }>Clear</button>
        </div>
        <div class='col-sm-6 smallpad'>
          <button id='swaprows' class='btn btn-primary btn-block' type='button' onClick={ swapRows }>Swap Rows</button>
        </div>
      </div></div>
    </div></div>
    <table class='table table-hover table-striped test-data'><tbody onClick={ clickRow }>{
      selectWhen(() => state.selected, (el, selected) => el.className = selected ? 'danger' : '')
      (each(() => state.data, row => {
        const rowId = untracked(() => row.id);
        return <tr model={(( rowId ))}>
          <td class='col-md-1' textContent={(( rowId ))} />
          <td class='col-md-4'><a>{ row.label }</a></td>
          <td class='col-md-1'><a><span class='delete glyphicon glyphicon-remove' /></a></td>
          <td class='col-md-6'/>
        </tr>
      }))
    }</tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>
}

root(() => document.getElementById("main").appendChild(<App />))
