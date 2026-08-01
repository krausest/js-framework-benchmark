import { magnet } from "@magnet-js/ui";
import { alien, preact, tc39 } from "@magnet-js/signal";
import { list } from "@magnet-js/list";

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

let idCounter = 1;

const buildData = (count = 1000) => {
  const result = new Array(count);
  for (let i = 0; i < count; i++) {
    result[i] = {
      id: idCounter++,
      label: state(
        `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`,
      ),
    };
  }
  return result;
};

// The source of truth: a signal of data rows. Selection is a single
// top-level state (the selected row id), never stored on the data objects.
const data = state([]);
const selected = state(null);

const remove = (row) => {
  if (selected.get() === row.id) selected.set(null);
  data.set(data.get().filter((r) => r !== row));
};

// Rows are rendered through list(): each row's <tr> is created once per data
// id and reused by the framework's cache, so swaps become moves, removals
// dispose only the removed row, and appends create only the new rows.
const rowEl = (row) =>
  html.tr(
    { class: computed(() => (selected.get() === row.id ? "danger" : "")) },
    [
      html.td({ class: "col-md-1" }, [row.id]),
      html.td({ class: "col-md-4" }, [
        html.a({ onclick: () => selected.set(row.id) }, [row.label]),
      ]),
      html.td({ class: "col-md-1" }, [
        html.a({ onclick: () => remove(row) }, [
          html.span({
            class: "glyphicon glyphicon-remove",
            "aria-hidden": "true",
          }),
        ]),
      ]),
      html.td({ class: "col-md-6" }),
    ],
  );

const run = () => {
  selected.set(null);
  data.set(buildData(1000));
};

const runLots = () => {
  selected.set(null);
  data.set(buildData(10000));
};

const add = () => {
  data.set(data.get().concat(buildData(1000)));
};

const update = () => {
  const d = data.get();
  for (let i = 0; i < d.length; i += 10) {
    const label = d[i].label;
    label.set(label.get() + " !!!");
  }
};

const clear = () => {
  selected.set(null);
  data.set([]);
};

const swapRows = () => {
  const d = data.get().slice();
  if (d.length > 998) {
    const tmp = d[1];
    d[1] = d[998];
    d[998] = tmp;
    data.set(d);
  }
};

document.getElementById("run").onclick = run;
document.getElementById("runlots").onclick = runLots;
document.getElementById("add").onclick = add;
document.getElementById("update").onclick = update;
document.getElementById("clear").onclick = clear;
document.getElementById("swaprows").onclick = swapRows;

m.render(document.getElementById("tbody"), [
  list(m)(data, rowEl, (row) => row.id),
]);
