import { html, render } from '../node_modules/lit-html/lit-html.js';

let startTime;
let lastMeasure;

const startMeasure = function(name) {
  startTime = performance.now();
  lastMeasure = name;
};
const stopMeasure = function() {
  window.setTimeout(function() {
    const stop = performance.now();
    console.log(lastMeasure + ' took ' + (stop - startTime));
  }, 0);
};

const adjectives = [
  'pretty',
  'large',
  'big',
  'small',
  'tall',
  'short',
  'long',
  'handsome',
  'plain',
  'quaint',
  'clean',
  'elegant',
  'easy',
  'angry',
  'crazy',
  'helpful',
  'mushy',
  'odd',
  'unsightly',
  'adorable',
  'important',
  'inexpensive',
  'cheap',
  'expensive',
  'fancy'
];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

let data = [];
let did = 1;
let selected = 0;

const add = () => {
  startMeasure('add');
  data = data.concat(buildData(1000));
  _render();
  stopMeasure();
};
const run = () => {
  startMeasure('run');
  data = buildData(1000);
  _render();
  stopMeasure();
};
const runLots = () => {
  startMeasure('runLots');
  data = buildData(10000);
  _render();
  stopMeasure();
};
const clear = () => {
  startMeasure('clear');
  data = [];
  _render();
  stopMeasure();
};
const interact = e => {
  const interaction = e.target.getAttribute('data-interaction');
  if (interaction === 'delete') {
    del(e.target.parentNode.item || e.target.parentNode.parentNode.item || e.target.parentNode.parentNode.parentNode.item);
  } else if (interaction === 'select') {
    select(e.target.parentNode.item || e.target.parentNode.parentNode.item);
  }
};
const del = id => {
  startMeasure('delete');
  const idx = data.findIndex(d => d.id === id);
  data.splice(idx, 1);
  _render();
  stopMeasure();
};
const select = id => {
  startMeasure('select');
  selected = id;
  _render();
  stopMeasure();
};
const swapRows = () => {
  startMeasure('swapRows');
  if (data.length > 998) {
    var tmp = data[1];
    data[1] = data[998];
    data[998] = tmp;
  }
  _render();
  stopMeasure();
};
const update = () => {
  startMeasure('update');
  for (let i = 0; i < data.length; i += 10) {
    data[i].label += ' !!!';
  }
  _render();
  stopMeasure();
};
const rowClass = (id, selected) => {
  return id === selected ? 'danger' : '';
};
const buildData = count => {
  const data = [];
  for (var i = 0; i < count; i++) {
    data.push({
      id: did++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
    });
  }
  return data;
};
const _random = max => {
  return Math.round(Math.random() * 1000) % max;
};

const container = document.getElementById('container');
const _render = () => {
  render(template(), container);
};

const template = () => html`
<div class="container">
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>Lit-HTML</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="run" @click=${run}>Create 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="runlots" @click=${runLots}>Create 10,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary
                        btn-block" id="add" @click=${add}>Append 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary
                        btn-block" id="update" @click=${update}>Update every 10th row</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary
                        btn-block" id="clear" @click=${clear}>Clear</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary
                        btn-block" id="swaprows" @click=${swapRows}>Swap Rows</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <table @click=${interact} class="table table-hover table-striped test-data">
    <tbody>${data.map(
      item => html`
      <tr .item=${item.id} class=${rowClass(item.id, selected)}>
        <td class="col-md-1">${item.id}</td>
        <td data-interaction='select' class="col-md-4">
          <a data-interaction='select'>${item.label}</a>
        </td>
        <td data-interaction='delete' class="col-md-1">
          <a data-interaction='delete'>
            <span data-interaction='delete' class="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </a>
        </td>
        <td class="col-md-6"></td>
      </tr>`
    )}
    </tbody>
  </table>
  <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>`;

_render();
