import { signal, createRoot, h, render, For } from "@wcstack/signals/dom";

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: signal(`${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`),
    };
  }
  return data;
}

const data = signal([]);
const selected = signal(0);

const run = () => {
  data.set(buildData(1000));
  selected.set(0);
};
const runLots = () => {
  data.set(buildData(10000));
  selected.set(0);
};
const add = () => {
  data.set(data.peek().concat(buildData(1000)));
};
const update = () => {
  const d = data.peek();
  for (let i = 0; i < d.length; i += 10) {
    d[i].label.set(d[i].label.peek() + " !!!");
  }
};
const clear = () => {
  data.set([]);
  selected.set(0);
};
const swapRows = () => {
  const d = data.peek();
  if (d.length > 998) {
    const copy = d.slice();
    [copy[1], copy[998]] = [copy[998], copy[1]];
    data.set(copy);
  }
};
const select = (id) => {
  selected.set(id);
};
const remove = (id) => {
  const d = data.peek();
  data.set(d.toSpliced(d.findIndex((row) => row.id === id), 1));
};

const Button = (id, text, fn) =>
  h("div", { class: "col-sm-6 smallpad" },
    h("button", { type: "button", class: "btn btn-primary btn-block", id, onClick: fn }, text),
  );

const Row = (row) =>
  h("tr", { class: () => (selected.get() === row.id ? "danger" : "") },
    h("td", { class: "col-md-1" }, String(row.id)),
    h("td", { class: "col-md-4" },
      h("a", { onClick: () => select(row.id) }, () => row.label.get()),
    ),
    h("td", { class: "col-md-1" },
      h("a", { onClick: () => remove(row.id) },
        h("span", { class: "glyphicon glyphicon-remove", "aria-hidden": "true" }),
      ),
    ),
    h("td", { class: "col-md-6" }),
  );

createRoot(() => {
  render(
    h("div", { class: "container" },
      h("div", { class: "jumbotron" },
        h("div", { class: "row" },
          h("div", { class: "col-md-6" },
            h("h1", null, 'wcstack-signals-"keyed"'),
          ),
          h("div", { class: "col-md-6" },
            h("div", { class: "row" },
              Button("run", "Create 1,000 rows", run),
              Button("runlots", "Create 10,000 rows", runLots),
              Button("add", "Append 1,000 rows", add),
              Button("update", "Update every 10th row", update),
              Button("clear", "Clear", clear),
              Button("swaprows", "Swap Rows", swapRows),
            ),
          ),
        ),
      ),
      h("table", { class: "table table-hover table-striped test-data" },
        h("tbody", null, For(data, Row, { key: (row) => row.id })),
      ),
      h("span", { class: "preloadicon glyphicon glyphicon-remove", "aria-hidden": "true" }),
    ),
    document.getElementById("main"),
  );
});
