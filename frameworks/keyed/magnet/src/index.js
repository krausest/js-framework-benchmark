import { magnet } from "@magnet-js/ui";
import { alien, preact, tc39 } from "@magnet-js/signal";

// MAGNET_SIGNALS is a build-time define (see build.mjs); it selects the
// signal implementation injected into Magnet. Defaults to preact.
const signals = { tc39, alien }[MAGNET_SIGNALS] || preact;
const { state, computed } = signals;
const m = magnet({ window, ...signals });
const { html } = m;

const adjectives = [
  "pretty", "large", "big", "small", "tall", "short", "long", "handsome",
  "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful",
  "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy",
];
const colours = [
  "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown",
  "white", "black", "orange",
];
const nouns = [
  "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie",
  "sandwich", "burger", "pizza", "mouse", "keyboard",
];

const _random = (max) => Math.round(Math.random() * 1000) % max;

let data = [];
let idCounter = 1;
let selectedRow;

// The rows signal mirrors `data` as an array of <tr> elements. Magnet renders
// it with a keyed diff (`updateList`) that reuses and moves existing nodes by
// identity, so appends, removals and swaps touch only the affected rows.
const rows = state([]);

const sync = () => rows.set(data.map((row) => row.el));

const select = (row) => {
  if (selectedRow) selectedRow.selected.set(false);
  selectedRow = row;
  row.selected.set(true);
};

const remove = (row) => {
  if (selectedRow === row) selectedRow = undefined;
  data = data.filter((r) => r !== row);
  sync();
};

const buildData = (count = 1000) => {
  const result = new Array(count);
  for (let i = 0; i < count; i++) {
    const row = {
      id: idCounter++,
      label: state(
        `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`,
      ),
      selected: state(false),
    };
    row.el = html.tr(
      { class: computed(() => (row.selected.get() ? "danger" : "")) },
      [
        html.td({ class: "col-md-1" }, [row.id]),
        html.td({ class: "col-md-4" }, [
          html.a({ onclick: () => select(row) }, [row.label]),
        ]),
        html.td({ class: "col-md-1" }, [
          html.a({ onclick: () => remove(row) }, [
            html.span({ class: "glyphicon glyphicon-remove", "aria-hidden": "true" }),
          ]),
        ]),
        html.td({ class: "col-md-6" }),
      ],
    );
    result[i] = row;
  }
  return result;
};

const run = () => {
  selectedRow = undefined;
  data = buildData(1000);
  sync();
};

const runLots = () => {
  selectedRow = undefined;
  data = buildData(10000);
  sync();
};

const add = () => {
  data = data.concat(buildData(1000));
  sync();
};

const update = () => {
  for (let i = 0; i < data.length; i += 10) {
    const label = data[i].label;
    label.set(label.get() + " !!!");
  }
};

const clear = () => {
  selectedRow = undefined;
  data = [];
  sync();
};

const swapRows = () => {
  if (data.length > 998) {
    const tmp = data[1];
    data[1] = data[998];
    data[998] = tmp;
    sync();
  }
};

document.getElementById("run").onclick = run;
document.getElementById("runlots").onclick = runLots;
document.getElementById("add").onclick = add;
document.getElementById("update").onclick = update;
document.getElementById("clear").onclick = clear;
document.getElementById("swaprows").onclick = swapRows;

m.render(document.getElementById("tbody"), [rows]);
