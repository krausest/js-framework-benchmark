import { useState, root } from 'solid-js';
import { r, selectWhen } from 'solid-js/dom';

function _random (max) { return Math.round(Math.random() * 1000) % max; };

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
    }
  }
  return data;
}

function App() {
  const [ state, setState ] = useState({ data: [], selected: null });

  return <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class ='col-md-6'><h1>SolidJS Keyed</h1></div>
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
    <table class='table table-hover table-striped test-data'><tbody onClick={ clickRow }>
      <$ each={ state.data } afterRender={ selectWhen(() => state.selected, 'danger') }>{
        row =>
          <tr model={ row.id }>
            <td class='col-md-1' textContent={ row.id } />
            <td class='col-md-4'><a>{( row.label )}</a></td>
            <td class='col-md-1'><a action={ 'remove' }><span class='glyphicon glyphicon-remove' /></a></td>
            <td class='col-md-6'/>
          </tr>
      }</$>
    </tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>

  function run() { setState({ data: buildData(1000), selected: null }); }

  function runLots() { setState({ data: buildData(10000), selected: null }); }

  function add() { setState('data', d => [...d, ...buildData(1000)]); }

  function update() { setState('data', { by: 10 }, 'label', l => l + ' !!!'); }

  function swapRows() { setState('data', d => d.length > 998 ? { 1: d[998], 998: d[1] } : d); }

  function clear() { setState({ data: [], selected: null }); }

  function clickRow(e, id, action) {
    action === 'remove' ?
      setState('data', d => {
        const idx = d.findIndex(d => d.id === id);
        return [...d.slice(0, idx), ...d.slice(idx + 1)];
      }) : setState('selected', id);
  }
}

root(() => document.getElementById("main").appendChild(<App />))
