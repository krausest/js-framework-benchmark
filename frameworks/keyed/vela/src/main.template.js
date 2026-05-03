// This file is folded into dist/main.js by build.mjs after compiling
// src/BenchmarkTable.vela with the Vela compiler. It mirrors the
// js-framework-benchmark keyed table button and DOM contract.
const ADJECTIVES = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const COLOURS = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const NOUNS = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
const ADJECTIVES_LEN = ADJECTIVES.length;
const COLOURS_LEN = COLOURS.length;
const NOUNS_LEN = NOUNS.length;
const LABELS = [];
for (let i = 0; i < ADJECTIVES_LEN; i++) {
  for (let j = 0; j < COLOURS_LEN; j++) {
    for (let k = 0; k < NOUNS_LEN; k++) {
      LABELS[(i * COLOURS_LEN + j) * NOUNS_LEN + k] = ADJECTIVES[i] + " " + COLOURS[j] + " " + NOUNS[k];
    }
  }
}
let nextId = 1;
const random = (max) => ((Math.random() * 1000 + 0.5) | 0) % max;
function fillData(data, start, count) {
  for (let i = 0; i < count; i++) {
    data[start + i] = {
      id: nextId++,
      label: LABELS[(random(ADJECTIVES_LEN) * COLOURS_LEN + random(COLOURS_LEN)) * NOUNS_LEN + random(NOUNS_LEN)]
    };
  }
  return data;
}
function buildData(count) {
  return fillData(new Array(count), 0, count);
}
function appendData(data, count) {
  const start = data.length;
  data.length = start + count;
  return fillData(data, start, count);
}
function button(id, text) {
  return `<div class="col-sm-6 smallpad"><button id="${id}" class="btn btn-primary btn-block" type="button">${text}</button></div>`;
}
const main = document.getElementById('main');
main.innerHTML =
  '<div class="container"><div class="jumbotron"><div class="row"><div class="col-md-6"><h1>Vela</h1></div><div class="col-md-6"><div class="row">' +
  button('run', 'Create 1,000 rows') +
  button('runlots', 'Create 10,000 rows') +
  button('add', 'Append 1,000 rows') +
  button('update', 'Update every 10th row') +
  button('clear', 'Clear') +
  button('swaprows', 'Swap Rows') +
  '</div></div></div></div><table id="vela-table-host" class="table table-hover table-striped test-data"></table><span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span></div>';
let rows = [];
let selected = null;
const tableHost = document.getElementById('vela-table-host');
const viewProps = { rows, selected, __velaMaxBank: 20000 };
const mounted = mountBenchmarkTable(tableHost, viewProps);
tableHost.removeAttribute('id');
function ensurePatchStyle() {
}
function sync() {
  viewProps.rows = rows;
  viewProps.selected = selected;
  mounted.update();
}
function run() { rows = buildData(1000); selected = null; sync(); }
function runLots() { rows = buildData(10000); selected = null; sync(); }
function add() { appendData(rows, 1000); sync(); }
function update() {
  const next = rows.slice();
  for (let i = 0; i < rows.length; i += 10) {
    const row = rows[i];
    next[i] = { id: row.id, label: row.label + ' !!!' };
  }
  rows = next;
  sync();
}
function clear() {
  rows = [];
  selected = null;
  viewProps.rows = rows;
  viewProps.selected = selected;
  mounted.clear();
}
function swapRows() {
  if (rows.length > 998) {
    const next = rows.slice();
    const tmp = next[1];
    next[1] = next[998];
    next[998] = tmp;
    rows = next;
    sync();
  }
}
function remove(id) {
  rows = rows.filter(row => row.id !== id);
  if (selected === id) selected = null;
  sync();
}
function select(id) { selected = id; sync(); }

document.getElementById('run').onclick = run;
document.getElementById('runlots').onclick = runLots;
document.getElementById('add').onclick = add;
document.getElementById('update').onclick = update;
document.getElementById('clear').onclick = clear;
document.getElementById('swaprows').onclick = swapRows;

tableHost.addEventListener('click', (event) => {
  const rowEl = event.target.closest('tr');
  if (!rowEl) return;
  const cell = event.target.closest('td');
  if (!cell || cell.parentNode !== rowEl) return;
  const id = Number(rowEl.firstElementChild?.textContent || 0);
  if (cell === rowEl.children[2]) remove(id);
  else if (cell === rowEl.children[1]) select(id);
});
