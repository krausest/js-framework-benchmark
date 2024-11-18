import Bau from "@grucloud/bau";

const bau = Bau();

const { a, button, div, tr, td, table, tbody, h1, span } = bau.tags;

const random = (max) => Math.round(Math.random() * 1000) % max;

const A = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard",
];

let nextId = 1;

const buildLabel = () => bau.state(`${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`);

const buildData = (count) => {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: buildLabel(),
    };
  }

  return data;
};

const dataState = bau.state([]);
let selectedRow = null;

const run = () => {
  dataState.val = buildData(1000);
  selectedRow = null;
};

const runLots = () => {
  dataState.val = buildData(10000);
  selectedRow = null;
};

const add = () => {
  dataState.val.push(...buildData(1000));
};

const update = () => {
  for (let i = 0; i < dataState.val.length; i += 10) {
    const r = dataState.val[i];
    const label = dataState.val[i].label;
    label.val = r.label.val + " !!!";
  }
};

const swapRows = () => {
  if (dataState.val.length > 998) {
    const data = dataState.val;
    const dataTmp = data[1];
    dataState.val[1] = data[998];
    dataState.val[998] = dataTmp;
  }
};

const clear = () => {
  dataState.val = [];
  selectedRow = null;
};

const remove = (id) => () => {
  const idx = dataState.val.findIndex((d) => d.id === id);
  if (idx > -1) {
    dataState.val.splice(idx, 1);
  }
};

const selectRow = (event) => {
  if (selectedRow) {
    selectedRow.className = "";
  }
  selectedRow = event.target.parentNode.parentNode;
  selectedRow.className = "danger";
};

const Row = ({ id, label }) => {
  const tdIdEl = td({ class: "col-md-1" }, id);
  const aLabelEl = a({ onclick: selectRow }, label);
  const aRemove = a({ onclick: remove(id) }, span({ class: "glyphicon glyphicon-remove", "aria-hidden": true }));

  return tr(
    {
      bauUpdate: (element, data) => {
        tdIdEl.textContent = data.id;
        aLabelEl.replaceWith(a({ onclick: selectRow }, data.label));
        aRemove.onclick = remove(data.id);
      },
    },
    tdIdEl,
    td({ class: "col-md-4" }, aLabelEl),
    td({ class: "col-md-1" }, aRemove),
    td({ class: "col-md-6" })
  );
};

const Button = ({ id, title, onclick }) =>
  div(
    { class: "col-sm-6 smallpad" },
    button({ type: "button", class: "btn btn-primary btn-block", id, onclick }, title)
  );

const Jumbotron = ({}) =>
  div(
    { class: "jumbotron" },
    div(
      { class: "row" },
      div({ class: "col-md-6" }, h1("Bau Non-Keyed Benchmark")),
      div(
        { class: "col-md-6" },
        div(
          { class: "row" },
          Button({ id: "run", title: "Create 1,000 rows", onclick: run }),
          Button({
            id: "runlots",
            title: "Create 10,000 rows",
            onclick: runLots,
          }),
          Button({
            id: "add",
            title: "Append 1,000 rows",
            onclick: add,
          }),
          Button({
            id: "update",
            title: "Update every 10th row",
            onclick: update,
          }),
          Button({
            id: "clear",
            title: "Clear",
            onclick: clear,
          }),
          Button({
            id: "swaprows",
            title: "Swap Row",
            onclick: swapRows,
          })
        )
      )
    )
  );

const Main = () =>
  div(
    { class: "container" },
    Jumbotron({}),
    table(
      { class: "table table-hover table-striped test-data" },
      bau.loop(dataState, tbody(), Row),
      span({
        class: "preloadicon glyphicon glyphicon-remove",
        "aria-hidden": true,
      })
    )
  );

const app = document.getElementById("app");
app.replaceChildren(Main({}));
