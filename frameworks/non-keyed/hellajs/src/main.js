import { html, mount, signal } from "@hellajs/core";

const random = (max) => Math.round(Math.random() * 1000) % max;

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let ID = 1;

const buildData = (count) => {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: ID++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }

  return data;
};

const data = signal([]);
const selected = signal(undefined);

function create(count) {
  data.set(buildData(count));
}

function append(count) {
  data.set([...data(), ...buildData(count)]);
}

function update() {
  const newData = [...data()];
  for (let i = 0; i < newData.length; i += 10) {
    if (i < newData.length) {
      newData[i] = { ...newData[i], label: `${newData[i].label} !!!` };
    }
  }
  data.set(newData);
}

function remove(id) {
  const idx = data().findIndex((d) => d.id === id);
  data.set([
    ...data().slice(0, idx),
    ...data().slice(idx + 1),
  ]);
}

function select(id) {
  selected.set(id);
}

function clear() {
  data.set([]);
}

function swapRows() {
  if (data().length > 998) {
    const newData = [...data()];
    const temp = newData[1];
    newData[1] = newData[998];
    newData[998] = temp;
    data.set(newData);
  }
}

const { div, table, tbody, tr, td, span, button, a, h1 } = html;

const actionButton = (label, id, fn) =>
  div(
    { className: "col-sm-6 smallpad" },
    button(
      {
        id,
        className: "btn btn-primary btn-block",
        type: "button",
        onclick: fn,
        preventDefault: true,
      },
      label,
    ),
  );

const jumbo = () =>
  div(
    { className: "jumbotron" },
    div(
      { className: "row" },
      div({ className: "col-md-6" }, h1("HellaJS")),
      div(
        { className: "col-md-6" },
        div(
          { className: "row" },
          actionButton("Create 1,000 rows", "run", () => create(1000)),
          actionButton("Create 10,000 rows", "runlots", () => create(10000)),
          actionButton("Append 1,000 rows", "add", () => append(1000)),
          actionButton("Update every 10th row", "update", () => update()),
          actionButton("Clear", "clear", () => clear()),
          actionButton("Swap Rows", "swaprows", () => swapRows()),
        ),
      ),
    ),
  );

const dataTable = () =>
  table(
    { className: "table table-hover table-striped test-data" },
    tbody(
      { id: "tbody" },
      ...data().map((item) =>
        tr(
          {
            dataset: {
              id: item.id.toString(),
            },
            className: selected() === item.id ? "danger" : "",
          },
          td({ className: "col-md-1" }, item.id.toString()),
          td(
            { className: "col-md-4" },
            a(
              {
                className: "lbl",
                onclick: () => select(item.id),
              },
              item.label,
            ),
          ),
          td(
            { className: "col-md-1" },
            a(
              {
                className: "remove",
                onclick: () => remove(item.id),
              },
              span({
                className: "glyphicon glyphicon-remove",
                ariaHidden: "true",
              }),
            ),
          ),
          td({ className: "col-md-6" }),
        ),
      ),
    ),
  );

const App = () =>
  div(
    { id: "main" },
    div(
      { className: "container" },
      jumbo(),
      dataTable(),
      span({
        className: "preloadicon glyphicon glyphicon-remove",
        ariaHidden: "true",
      }),
    ),
  );

mount(App);
