import Solid, { State } from 'solid-js';

function _random (max) {
  return Math.round(Math.random() * 1000) % max;
};

function rowId ({target: el}) {
  while (el.tagName !== 'TR') {
    el = el.parentElement;
  }
  return +el.childNodes[0].textContent;
};

var idCounter = 1
var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
function buildData(count) {
  var data, i, ref;
  data = new Array(count);
  for (i = 0, ref = count; i < ref; i++) {
    data[i] = {
      id: idCounter++,
      label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
    }
  }
  return data;
}

// Chrome for some reason clears more performantly after an animation frame
// Thanks to Adam from Surplus.js pointing that out
async function clearAfterAnimationFrame(v) {
  if (v.length) return v;

  await new Promise(requestAnimationFrame);
  return v;
};

export default class App {
  static template({state, run, runLots, add, update, clear, swapRows, handleClick}) {
    return <div class='container'>
      <div class='jumbotron'><div class='row'>
        <div class ='col-md-6'><h1>SolidJS Keyed</h1></div>
        <div class ='col-md-6'><div class ='row'>
          <div class ='col-sm-6 smallpad'>
            <button id='run' class='btn btn-primary btn-block' type='button' onClick={run}>Create 1,000 rows</button>
          </div>
          <div class='col-sm-6 smallpad'>
            <button id='runlots' class='btn btn-primary btn-block' type='button' onClick={runLots}>Create 10,000 rows</button>
          </div>
          <div class='col-sm-6 smallpad'>
            <button id='add' class='btn btn-primary btn-block' type='button' onClick={add}>Append 1,000 rows</button>
          </div>
          <div class='col-sm-6 smallpad'>
            <button id='update' class='btn btn-primary btn-block' type='button' onClick={update}>Update every 10th row</button>
          </div>
          <div class='col-sm-6 smallpad'>
            <button id='clear' class='btn btn-primary btn-block' type='button' onClick={clear}>Clear</button>
          </div>
          <div class='col-sm-6 smallpad'>
            <button id='swaprows' class='btn btn-primary btn-block' type='button' onClick={swapRows}>Swap Rows</button>
          </div>
        </div></div>
      </div></div>
      <table class='table table-hover table-striped test-data' onClick={handleClick}><tbody>{
        Solid(() => state.data).mapS(row =>
          <tr>
            <td class='col-md-1'>{/*@skip*/row.id}</td>
            <td class='col-md-4'><a>{row.label}</a></td>
            <td class='col-md-1'><a><span class='delete glyphicon glyphicon-remove' /></a></td>
            <td class='col-md-6'/>
          </tr>
        ).map(clearAfterAnimationFrame)
      }</tbody></table>
      <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
    </div>
  }

  constructor() {
    this.handleClick = this.handleClick.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.run = this.run.bind(this);
    this.runLots = this.runLots.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.swapRows = this.swapRows.bind(this);
    this.clear = this.clear.bind(this);
    this.state = new State({
      data: [],
      selected: null
    });
  }

  handleClick(e) {
    var el;
    e.stopPropagation();
    if (e.target.matches('.delete')) {
      return this.onRemove(rowId(e));
    } else {
      el = e.target;
      while (el.tagName !== 'TR') {
        el = el.parentElement;
      }
      return this.onSelect(el);
    }
  }

  onRemove(id) {
    this.state.set({
      data: this.state.data.filter(function(test) {
        return test.id !== id;
      })
    });
  }

  onSelect(newSelected) {
    var selected;
    if (newSelected === (selected = this.state.selected)) {
      return;
    }
    if (selected) {
      selected.className = '';
    }
    newSelected.className = 'danger';
    this.state.set({
      selected: newSelected
    });
  }

  run(e) {
    e.stopPropagation();
    this.state.set({
      data: buildData(1000),
      selected: null
    });
  }

  runLots(e) {
    e.stopPropagation();
    this.state.set({
      data: buildData(10000),
      selected: null
    });
  }

  add(e) {
    e.stopPropagation();
    this.state.set({
      data: this.state.data.concat(buildData(1000))
    });
  }

  update(e) {
    var index;
    e.stopPropagation();
    index = 0;
    while (index < this.state.data.length) {
      this.state.replace('data', index, 'label', this.state.data[index].label += ' !!!');
      index += 10;
    }
  }

  swapRows(e) {
    e.stopPropagation();
    if (this.state.data.length >= 998) {
      this.state.set('data', {
        1: this.state.data[998],
        998: this.state.data[1]
      });
    }
  }

  clear(e) {
    e.stopPropagation();
    this.state.set({
      data: [],
      selected: null
    });
  }
};

