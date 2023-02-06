// @ts-nocheck
import { createInstance, useValue, FC } from "gyron";

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

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

function buildData(count) {
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
}

const rows = useValue([]);
const selected = useValue(null);

function run() {
  rows.value = buildData(1e3);
}

function add() {
  rows.value = rows.value.concat(buildData(1e3));
}

function addLots() {
  rows.value = buildData(1e4);
}

function select(id) {
  selected.value = id;
}

function update() {
  const _rows = rows.value;
  for (let i = 0; i < _rows.length; i += 10) {
    _rows[i].label += " !!!";
  }
}

function clear() {
  rows.value = [];
}

function swap() {
  const _rows = rows.value;
  if (_rows.length > 998) {
    const d1 = _rows[1];
    const d998 = _rows[998];
    _rows[1] = d998;
    _rows[998] = d1;
  }
}

function remove(id) {
  rows.value.splice(
    rows.value.findIndex((d) => d.id === id),
    1
  );
}

const Button = FC(({ text, id, onClick }) => {
  return (
    <div class="col-sm-6 smallpad">
      <button id={id} onClick={onClick} class="btn btn-primary btn-block">
        {text}
      </button>
    </div>
  );
});

const ButtonGroup = FC(() => {
  return (
    <div class="row">
      <h1 class="col-md-6">Gyron.js Keyed</h1>
      <div class="col-md-6 row">
        <Button text="Create 1,000 rows" id="run" onClick={run} />
        <Button text="Create 10,000 rows" id="runlots" onClick={addLots} />
        <Button text="Append 1,000 rows" id="add" onClick={add} />
        <Button text="Update every 10th row" id="update" onClick={update} />
        <Button text="Clear" id="clear" onClick={clear} />
        <Button text="Swap Rows" id="swaprows" onClick={swap} />
      </div>
    </div>
  );
});

const Table = FC(() => {
  return (
    <table class="table table-hover table-striped test-data">
      <tbody>
        {rows.value.map(({ id, label }) => {
          return (
            <tr
              key={id}
              class={id === selected.value ? "danger" : null}
              memo={[id === selected.value, label]}
            >
              <td class="col-md-1">{id}</td>
              <td class="col-md-4">
                <a onClick={() => select(id)}>{label}</a>
              </td>
              <td class="col-md-1">
                <a onClick={() => remove(id)}>
                  <span
                    class="glyphicon glyphicon-remove"
                    aria-hidden="true"
                  ></span>
                </a>
              </td>
              <td class="col-md-6"></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});

const Main = FC(() => {
  return (
    <div class="container">
      <div class="jumbotron">
        <ButtonGroup />
      </div>
      <Table />
      <span
        class="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      ></span>
    </div>
  );
});

createInstance(<Main />).render("#main");
