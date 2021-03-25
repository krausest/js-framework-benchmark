import { html, render, key, component } from "1more";

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
  const data = [];
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

let state = {
  data: [],
  selected: undefined,
};

const actions = {
  run() {
    state = { ...state, data: buildData(1000) };
    _render();
  },
  add() {
    state = { ...state, data: state.data.concat(buildData(1000)) };
    _render();
  },
  runlots() {
    state = { ...state, data: buildData(10000) };
    _render();
  },
  cleardata() {
    state = { data: [], selected: undefined };
    _render();
  },
  update() {
    const data = state.data.slice();
    for (let i = 0; i < data.length; i += 10) {
      const item = data[i];
      data[i] = { ...item, label: item.label + " !!!" };
    }
    state = { ...state, data };
    _render();
  },
  select(id) {
    state = { ...state, selected: id };
    _render();
  },
  remove(id) {
    const data = state.data.slice();
    const idx = data.findIndex(item => item.id === id);
    data.splice(idx, 1);
    state = { ...state, data };
    _render();
  },
  swaprows() {
    const data = state.data.slice();
    const tmp = data[1];
    data[1] = data[998];
    data[998] = tmp;
    state = { ...state, data };
    _render();
  },
};

const Item = component(() => item => html`
  <tr class=${item.selected ? "danger" : null}>
    <td class="col-md-1">${item.id}</td>
    <td class="col-md-4">
      <a onclick=${() => actions.select(item.id)}>${item.label}</a>
    </td>
    <td class="col-md-1">
      <a onclick=${() => actions.remove(item.id)}>
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
`);

const App = component(() => state => html`
  <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>1more</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-6 smallpad">
              <button
                type="button"
                class="btn btn-primary btn-block"
                id="run"
                onclick=${actions.run}
              >
                Create 1,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                type="button"
                class="btn btn-primary btn-block"
                id="runlots"
                onclick=${actions.runlots}
              >
                Create 10,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                type="button"
                class="btn btn-primary btn-block"
                id="add"
                onclick=${actions.add}
              >
                Append 1,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                type="button"
                class="btn btn-primary btn-block"
                id="update"
                onclick=${actions.update}
              >
                Update every 10th row
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                type="button"
                class="btn btn-primary btn-block"
                id="clear"
                onclick=${actions.cleardata}
              >
                Clear
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                type="button"
                class="btn btn-primary btn-block"
                id="swaprows"
                onclick=${actions.swaprows}
              >
                Swap Rows
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped test-data">
      <tbody>
        ${state.data.map(item =>
          key(
            item.id,
            Item(
              state.selected === item.id ? { ...item, selected: true } : item,
            ),
          ),
        )}
      </tbody>
    </table>
    <span
      class="preloadicon glyphicon glyphicon-remove"
      aria-hidden="true"
    ></span>
  </div>
`);

const container = document.getElementById("main");

const _render = () => {
  render(App(state), container);
};
_render();
