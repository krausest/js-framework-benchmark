import { Fragment, render, mount, h } from "lithent";
import { cacheUpdate } from "lithent/helper";

type Row = { id: number; label: string; view: ReturnType<typeof cacheUpdate> };

type State = {
  rows: Row[];
  selected: number | null;
};

type Store = {
  state: State;
  buildData: (count: number) => Row[];
  run: () => void;
  runLots: () => void;
  add: () => void;
  update: () => void;
  clear: () => void;
  swapRows: () => void;
  remove: (id: number) => void;
  select: (id: number) => void;
};

const adjectives = [
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
const colours = [
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
const nouns = [
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

const random = (max: number) => Math.round(Math.random() * 1000) % max;

const buildLabel = () =>
  `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`;

let nextId = 1;

const store: Store = {
  state: { rows: [], selected: null },
  buildData(count) {
    const data = new Array<Row>(count);
    for (let i = 0; i < count; i += 1) {
      data[i] = makeRow(nextId, buildLabel());
      nextId += 1;
    }
    return data;
  },
  run() {
    this.state.rows = this.buildData(1000);
  },
  runLots() {
    this.state.rows = this.buildData(10000);
  },
  add() {
    this.state.rows = this.state.rows.concat(this.buildData(1000));
  },
  update() {
    const { rows } = this.state;
    for (let i = 0; i < rows.length; i += 10) {
      rows[i].label += " !!!";
    }
  },
  clear() {
    this.state.rows = [];
    this.state.selected = null;
  },
  swapRows() {
    const { rows } = this.state;
    if (rows.length > 998) {
      const tmp = rows[1];
      rows[1] = rows[998];
      rows[998] = tmp;
    }
  },
  remove(id) {
    this.state.rows = this.state.rows.filter((r) => r.id !== id);
  },
  select(id) {
    this.state.selected = id;
  },
};

// Only the table needs to renew after a store action.
let renewTable = () => {};

function makeRow(id: number, label: string): Row {
  const onSelect = () => {
    store.select(id);
    renewTable();
  };
  const onRemove = () => {
    store.remove(id);
    renewTable();
  };

  // This row has no local state or lifecycle. Cache its keyed DOM tree
  // without introducing a mounted component for every row.
  const row: Row = {
    id,
    label,
    view: cacheUpdate(
      () => [row.label, store.state.selected === id],
      () => (
        <tr key={id} class={store.state.selected === id ? "danger" : undefined}>
          <td class="col-md-1">{id}</td>
          <td class="col-md-4">
            <a onClick={onSelect}>{row.label}</a>
          </td>
          <td class="col-md-1">
            <a onClick={onRemove}>
              <span class="glyphicon glyphicon-remove" aria-hidden="true" />
            </a>
          </td>
          <td class="col-md-6" />
        </tr>
      ),
    ),
  };
  return row;
}

const Table = mount((renew) => {
  renewTable = renew;
  return () => (
    <Fragment>{store.state.rows.map((row) => row.view(row))}</Fragment>
  );
});

const App = mount(() => {
  const action = (run: () => void) => () => {
    run();
    renewTable();
  };
  const buttons = [
    {
      id: "run",
      text: "Create 1,000 rows",
      onClick: action(() => store.run()),
    },
    {
      id: "runlots",
      text: "Create 10,000 rows",
      onClick: action(() => store.runLots()),
    },
    {
      id: "add",
      text: "Append 1,000 rows",
      onClick: action(() => store.add()),
    },
    {
      id: "update",
      text: "Update every 10th row",
      onClick: action(() => store.update()),
    },
    { id: "clear", text: "Clear", onClick: action(() => store.clear()) },
    {
      id: "swaprows",
      text: "Swap Rows",
      onClick: action(() => store.swapRows()),
    },
  ];

  return () => (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Lithent-&quot;keyed&quot;</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              {buttons.map(({ id, text, onClick }) => (
                <div key={id} class="col-sm-6 smallpad">
                  <button
                    type="button"
                    class="btn btn-primary btn-block"
                    id={id}
                    onClick={onClick}
                  >
                    {text}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody id="tbody">
          <Table />
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
});

render(<App />, document.getElementById("main"));
