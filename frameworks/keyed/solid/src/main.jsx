import { State, root, memo } from 'solid-js';
import { r, selectOn, delegateEvent } from 'solid-js/dom';

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
  let rowId, selectClass, clickSelect, clickRemove, tbody;
  const state = new State({ data: [], selected: null });

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
    <table class='table table-hover table-striped test-data'><tbody ref={ tbody }>{
      (selectClass = selectOn(() => state.selected, (el, selected) => el.className = selected ? 'danger' : ''),
      clickSelect = delegateEvent(tbody, 'click', onSelect),
      clickRemove = delegateEvent(tbody, 'click', onRemove),
      memo(row =>
        (rowId = row.sample('id'),
        <tr $selectClass={ rowId }>
          <td class='col-md-1' textContent={(( rowId ))} />
          <td class='col-md-4'><a $clickSelect={ rowId }>{ row.label }</a></td>
          <td class='col-md-1'><a $clickRemove={ rowId }><span class='delete glyphicon glyphicon-remove' /></a></td>
          <td class='col-md-6'/>
        </tr>)
      )(() => state.data))
    }</tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>

  function onRemove(id, e) {
    e.stopPropagation();
    state.set({
      data: state.data.filter(row => row.id !== id)
    });
  }

  function onSelect(id, e) {
    e.stopPropagation();
    state.set({ selected: id });
  }

  function run(e) {
    e.stopPropagation();
    state.set({
      data: buildData(1000),
      selected: null
    });
  }

  function runLots(e) {
    e.stopPropagation();
    state.set({
      data: buildData(10000),
      selected: null
    });
  }

  function add(e) {
    e.stopPropagation();
    state.set({
      data: state.data.concat(buildData(1000))
    });
  }

  function update(e) {
    e.stopPropagation();
    let index = 0;
    while (index < state.data.length) {
      state.replace('data', index, 'label', state.data[index].label + ' !!!');
      index += 10;
    }
  }

  function swapRows(e) {
    e.stopPropagation();
    if (state.data.length > 998) {
      state.set('data', {
        1: state.data[998],
        998: state.data[1]
      });
    }
  }

  function clear(e) {
    e.stopPropagation();
    state.set({
      data: [],
      selected: null
    });
  }
}

root(() => document.getElementById("main").appendChild(<App />))
