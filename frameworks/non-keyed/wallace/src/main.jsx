import { mount } from "wallace";

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

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }
  return data;
}

let items = [],
  selected = 0,
  nextId = 1;
const add = () => (items = items.concat(buildData(1000))),
  clear = () => {
    items = [];
    selected = undefined;
  },
  update10th = () => {
    for (let i = 0; i < items.length; i += 10) {
      items[i].label += " !!!";
    }
  },
  rowCss = (row) => (row.id === selected ? "danger" : ""),
  removeRow = (rowId) => {
    items.splice(
      items.findIndex((x) => x.id === rowId),
      1
    );
    root.update();
  },
  run = () => {
    items = buildData(1000);
    selected = undefined;
  },
  runLots = () => {
    items = buildData(10000);
    selected = undefined;
  },
  selectRow = (rowId) => {
    selected = rowId;
    root.update();
  },
  swapRows = () => {
    if (items.length > 998) {
      const temp = items[1];
      items[1] = items[998];
      items[998] = temp;
    }
  },
  buttons = [
    { id: "run", title: "Create 1,000 rows", cb: run },
    { id: "runlots", title: "Create 10,000 rows", cb: runLots },
    { id: "add", title: "Append 1,000 rows", cb: add },
    { id: "update", title: "Update every 10th row", cb: update10th },
    { id: "clear", title: "Clear", cb: clear },
    { id: "swaprows", title: "Swap Rows", cb: swapRows },
  ].map((button) => {
    button.callback = (_) => {
      button.cb();
      root.update();
    };
    return button;
  });

// Wallace code starts here

const MainView = () => (
  <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>Wallace non-keyed</h1>
        </div>
        <div class="col-md-6">
          <Button.repeat items={buttons} />
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped test-items">
      <tbody id="tbody">
        <Row.repeat items={items} />
      </tbody>
    </table>
  </div>
);

const Button = (btn) => (
  <div class="col-sm-6 smallpad">
    <button id={btn.id} onClick={btn.callback()} class="btn btn-primary btn-block">
      {btn.title}
    </button>
  </div>
);

const Row = (row) => (
  <tr className={rowCss(row)}>
    <td class="col-md-1">{row.id}</td>
    <td class="col-md-4">
      <a onClick={selectRow(row.id)} class="lbl">
        {row.label}
      </a>
    </td>
    <td class="col-md-1">
      <a class="remove" onClick={removeRow(row.id)}>
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
);

const root = mount("main", MainView);
