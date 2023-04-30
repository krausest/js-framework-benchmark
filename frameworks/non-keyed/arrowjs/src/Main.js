import { reactive, html } from './arrow.js';
let data = reactive({
  items: [],
  selected: undefined,
});

let rowId = 1;
const add = () => data.items = data.items.concat(buildData(1000)),
  clear = () => {
    data.items = [];
    data.selected = undefined;
  },
  partialUpdate = () => {
    for (let i = 0; i < data.items.length; i += 10) {
      data.items[i].label += ' !!!';
    }
  },
  remove = (num) => {
    const idx = data.items.findIndex(d => d.id === num);
    data.items.splice(idx, 1);
  },
  run = () => {
    data.items = buildData(1000);
    data.selected = undefined;
  },
  runLots = () => {
    data.items = buildData(10000);
    data.selected = undefined;
  },
  select = (id) => data.selected = id,
  swapRows = () => {
    if (data.items.length > 998) {
      data.items = [data.items[0], data.items[998], ...data.items.slice(2, 998), data.items[1], data.items[999]];
    }
  };

function _random(max) { return Math.round(Math.random() * 1000) % max; };

function buildData(count = 1000) {
  const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
    colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
    nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"],
    data = new Array(count);
  for (var i = 0; i < count; i++)
    data[i] = { id: rowId++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] };
  return data;
}
html`<div>
  <div class="jumbotron">
  <div class="row">
    <div class="col-md-6">
      <h1>Arrowjs (Non-keyed)</h1>
    </div>
    <div class="col-md-6">
      <div class="row">
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="run" @click="${run}">Create 1,000 rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="runlots" @click="${runLots}">Create 10,000
            rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="add" @click="${add}">Append 1,000 rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="update" @click="${partialUpdate}">Update every
            10th row</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="clear" @click="${clear}">Clear</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="swaprows" @click="${swapRows}">Swap Rows</button>
        </div>
      </div>
    </div>
  </div>
  </div>
  <table class="table table-hover table-striped test-data">
    <tbody>
      ${() =>
    data.items.map((row) => html`<tr class="${() => data.selected === row.id ? 'danger' : ''}">
          <td class="col-md-1">${row.id}</td>
          <td class="col-md-4">
            <a @click="${() => select(row.id)}">${row.label}</a>
          </td>
          <td class="col-md-1">
            <a @click="${() => remove(row.id)}">
            <span class="glyphicon glyphicon-remove" aria-hidden="true" />
            </a>
          </td>
          <td class="col-md-6"/>
        </tr>`
    )}
    </tbody>
  </table>
</div>
`(document.getElementById('arrow'))