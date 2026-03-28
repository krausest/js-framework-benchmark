/**
 * Lattice keyed benchmark — compiled output
 *
 * This is what the Lattice compiler (lattice-rs) emits for a keyed list app.
 * The compiler transforms .lat templates into optimized vanilla JS with:
 *   - Template cloning (no innerHTML parsing at runtime)
 *   - Direct DOM mutation (no virtual DOM, no diffing)
 *   - Compiler-generated event delegation
 *   - Item references stored on DOM nodes for O(1) keyed lookups
 *
 * Source .lat template: https://github.com/nicoobc/lattice
 */
"use strict";

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const rowTemplate = document.createElement("tr");
rowTemplate.innerHTML =
  "<td class='col-md-1'> </td><td class='col-md-4'><a> </a></td><td class='col-md-1'><a><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td>";

const adjectives = [
  "pretty", "large", "big", "small", "tall", "short", "long", "handsome",
  "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy",
  "helpful", "mushy", "odd", "unsightly", "adorable", "important",
  "inexpensive", "cheap", "expensive", "fancy"
];
const colours = [
  "red", "yellow", "blue", "green", "pink", "brown", "purple",
  "brown", "white", "black", "orange"
];
const nouns = [
  "table", "chair", "house", "bbq", "desk", "car", "pony",
  "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"
];

let nextId = 1;
let data = [];
let rows = [];
let selectedRow = undefined;

const tbody = document.getElementById("tbody");
const table = document.getElementsByTagName("table")[0];

function buildData(count) {
  const result = new Array(count);
  for (let i = 0; i < count; i++) {
    result[i] = {
      id: nextId++,
      label:
        adjectives[_random(adjectives.length)] + " " +
        colours[_random(colours.length)] + " " +
        nouns[_random(nouns.length)]
    };
  }
  return result;
}

function createRow(item) {
  const tr = rowTemplate.cloneNode(true);
  const td1 = tr.firstChild;
  const a2 = td1.nextSibling.firstChild;
  tr.data_id = item.id;
  td1.firstChild.nodeValue = item.id;
  a2.firstChild.nodeValue = item.label;
  return tr;
}

function appendRows() {
  const empty = !tbody.firstChild;
  empty && tbody.remove();
  for (let i = rows.length; i < data.length; i++) {
    const tr = createRow(data[i]);
    rows[i] = tr;
    tbody.appendChild(tr);
  }
  empty && table.insertBefore(tbody, null);
}

function removeAllRows() {
  tbody.textContent = "";
}

function unselect() {
  if (selectedRow !== undefined) {
    selectedRow.className = "";
    selectedRow = undefined;
  }
}

function run() {
  removeAllRows();
  rows = [];
  data = buildData(1000);
  appendRows();
  unselect();
}

function runLots() {
  removeAllRows();
  rows = [];
  data = buildData(10000);
  appendRows();
  unselect();
}

function add() {
  data = data.concat(buildData(1000));
  appendRows();
}

function update() {
  for (let i = 0; i < data.length; i += 10) {
    data[i].label += " !!!";
    rows[i].childNodes[1].childNodes[0].firstChild.nodeValue = data[i].label;
  }
}

function clear() {
  data = [];
  rows = [];
  removeAllRows();
  unselect();
}

function swapRows() {
  if (data.length > 998) {
    const tmp = data[1];
    data[1] = data[998];
    data[998] = tmp;

    tbody.insertBefore(rows[998], rows[2]);
    tbody.insertBefore(rows[1], rows[999]);

    const tmpRow = rows[998];
    rows[998] = rows[1];
    rows[1] = tmpRow;
  }
}

function findIdx(id) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) return i;
  }
  return undefined;
}

function select(idx) {
  unselect();
  selectedRow = rows[idx];
  selectedRow.className = "danger";
}

function del(idx) {
  rows[idx].remove();
  data.splice(idx, 1);
  rows.splice(idx, 1);
  // Restore selection if it was on a different row
  if (selectedRow !== undefined) {
    const selId = selectedRow.data_id;
    const selIdx = findIdx(selId);
    if (selIdx !== undefined) {
      selectedRow = rows[selIdx];
      selectedRow.className = "danger";
    } else {
      selectedRow = undefined;
    }
  }
}

// Compiler-generated event delegation
document.getElementById("main").addEventListener("click", (e) => {
  if (e.target.matches("#add")) { e.stopPropagation(); add(); }
  else if (e.target.matches("#run")) { e.stopPropagation(); run(); }
  else if (e.target.matches("#update")) { e.stopPropagation(); update(); }
  else if (e.target.matches("#runlots")) { e.stopPropagation(); runLots(); }
  else if (e.target.matches("#clear")) { e.stopPropagation(); clear(); }
  else if (e.target.matches("#swaprows")) { e.stopPropagation(); swapRows(); }
});

tbody.addEventListener("click", (e) => {
  e.stopPropagation();
  let p = e.target;
  while (p && p.tagName !== "TD") {
    p = p.parentNode;
  }
  if (!p) return;
  const tr = p.parentNode;
  const id = tr.data_id;
  const idx = findIdx(id);
  if (idx === undefined) return;

  if (tr.childNodes[1] === p) {
    select(idx);
  } else if (tr.childNodes[2] === p) {
    del(idx);
  }
});
