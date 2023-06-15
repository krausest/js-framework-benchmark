//import Bau from "@grucloud/bau";
import Bau from "../../../../bau/bau/src/bau";

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
const C = [
  "red",
  "yellow",
  "blue",
  "green",
  "pink",
  "brown",
  "purple",
  "brown",
  "white",
  "black",
  "orange",
];
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

const buildData = (count) => {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${
        N[random(N.length)]
      }`,
    };
  }

  return data;
};

const dataState = bau.state([]);
const selectedState = bau.state(0);

const run = () => {
  dataState.val = buildData(1000);
  selectedState.val = 0;
};

const runLots = () => {
  dataState.val = buildData(10000);
  selectedState.val = 0;
};

const add = () => {
  dataState.val.push(...buildData(1000));
};

const update = () => {
  for (let i = 0; i < dataState.val.length; i += 10) {
    const r = dataState.val[i];
    dataState.val[i].label = r.label + " !!!";
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
  selectedState.val = 0;
};

const remove = ({ id, event }) => {
  const idx = dataState.val.findIndex((d) => d.id === id);
  if (idx > -1) {
    dataState.val.splice(idx, 1);
  }
};

const select = ({ id, event }) => {
  selectedState.val = id;
};

const Row = ({ id, label }) =>
  tr(
    {
      class: {
        deps: [selectedState],
        renderProp: (selected) => (selected == id ? "danger" : ""),
      },
    },

    td({ class: "col-md-1" }, id),
    td(
      { class: "col-md-4" },
      a({ onclick: (event) => select({ id, event }) }, label)
    ),
    td(
      { class: "col-md-1" },
      a(
        { onclick: (event) => remove({ id, event }) },
        span({ class: "glyphicon glyphicon-remove", "aria-hidden": true })
      )
    ),
    td({ class: "col-md-6" })
  );

const Button = ({ id, title, onclick }) =>
  div(
    { class: "col-sm-6 smallpad" },
    button(
      { type: "button", class: "btn btn-primary btn-block", id, onclick },
      title
    )
  );

const Jumbotron = ({}) =>
  div(
    { class: "jumbotron" },
    div(
      { class: "row" },
      div({ class: "col-md-6" }, h1("Bau Benchmark")),
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
      bau.bind({
        deps: [dataState],
        render:
          ({ renderItem }) =>
          (arr) =>
            tbody(arr.map(renderItem())),
        renderItem: () => Row,
      }),
      span({
        class: "preloadicon glyphicon glyphicon-remove",
        "aria-hidden": true,
      })
    )
  );

const app = document.getElementById("app");
app.replaceChildren(Main({}));
