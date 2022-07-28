import * as forgo from "forgo";

import type { ForgoComponentCtor, ForgoComponentProps } from "forgo";

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

interface Row {
  id: number;
  label: string;
}

class Store {
  public data: Row[];
  public backup: typeof this.data | null;
  public selected: unknown;
  public id: number;

  constructor() {
    this.data = [];
    this.backup = null;
    this.selected = null;
    this.id = 1;
  }
  buildData(count = 1000) {
    var adjectives = [
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
    var colours = [
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
    var nouns = [
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
    var data = [];
    for (var i = 0; i < count; i++)
      data.push({
        id: this.id++,
        label:
          adjectives[_random(adjectives.length)] +
          " " +
          colours[_random(colours.length)] +
          " " +
          nouns[_random(nouns.length)],
      });
    return data;
  }
  updateData(mod = 10) {
    for (let i = 0; i < this.data.length; i += 10) {
      this.data[i].label += " !!!";
      // this.data[i] = Object.assign({}, this.data[i], {label: this.data[i].label +' !!!'});
    }
  }
  delete(id) {
    const idx = this.data.findIndex((d) => d.id == id);
    this.data = this.data.filter((e, i) => i != idx);
    return this;
  }
  run() {
    this.data = this.buildData();
    this.selected = null;
  }
  add() {
    this.data = this.data.concat(this.buildData(1000));
    this.selected = null;
  }
  update() {
    this.updateData();
    this.selected = null;
  }
  select(id) {
    this.selected = id;
  }
  hideAll() {
    this.backup = this.data;
    this.data = [];
    this.selected = null;
  }
  showAll() {
    this.data = this.backup;
    this.backup = null;
    this.selected = null;
  }
  runLots() {
    this.data = this.buildData(10000);
    this.selected = null;
  }
  clear() {
    this.data = [];
    this.selected = null;
  }
  swapRows() {
    if (this.data.length > 998) {
      var a = this.data[1];
      this.data[1] = this.data[998];
      this.data[998] = a;
    }
  }
}

const RowComponent: ForgoComponentCtor<
  ForgoComponentProps & {
    row: Row;
    selected: boolean;
    selectSelf: () => void;
    deleteSelf: () => void;
  }
> = () => {
  return {
    render({ row, selectSelf, deleteSelf, selected }) {
      return (
        <tr onclick={selectSelf} class={selected ? "danger" : ""}>
          <td class="col-md-1">{row.id}</td>
          <td class="col-md-4">
            <a class="lbl">{row.label}</a>
          </td>
          <td class="col-md-1">
            <a class="remove" onclick={deleteSelf}>
              <span
                class="remove glyphicon glyphicon-remove"
                aria-hidden="true"
              ></span>
            </a>
          </td>
          <td class="col-md-6"></td>
        </tr>
      );
    },
  };
};

const App: ForgoComponentCtor<ForgoComponentProps> = () => {
  const store = new Store();

  return {
    render(_props, args) {
      const run = () => {
        store.clear();
        store.run();
        args.update();
      };
      const runLots = () => {
        store.clear();
        store.runLots();
        args.update();
      };
      const append1000Rows = () => {
        store.add();
        args.update();
      };
      const updateEvery10thRow = () => {
        store.update();
        args.update();
      };
      const swapRows = () => {
        store.swapRows();
        args.update();
      };
      const clear = () => {
        store.clear();
        args.update();
      };

      const selectRow = (id: number) => {
        store.select(id);
        args.update();
      };
      const deleteRow = (id: number) => {
        store.delete(id);
        args.update();
      };

      return (
        <div class="container">
          <div class="jumbotron">
            <div class="row">
              <div class="col-md-6">
                <h1>ForgoJS-"keyed"</h1>
              </div>
              <div class="col-md-6">
                <div class="row">
                  <div class="col-sm-6 smallpad">
                    <button
                      type="button"
                      class="btn btn-primary btn-block"
                      id="run"
                      onclick={run}
                    >
                      Create 1,000 rows
                    </button>
                  </div>
                  <div class="col-sm-6 smallpad">
                    <button
                      type="button"
                      class="btn btn-primary btn-block"
                      id="runlots"
                      onclick={runLots}
                    >
                      Create 10,000 rows
                    </button>
                  </div>
                  <div class="col-sm-6 smallpad">
                    <button
                      type="button"
                      class="btn btn-primary btn-block"
                      id="add"
                      onclick={append1000Rows}
                    >
                      Append 1,000 rows
                    </button>
                  </div>
                  <div class="col-sm-6 smallpad">
                    <button
                      type="button"
                      class="btn btn-primary btn-block"
                      id="update"
                      onclick={updateEvery10thRow}
                    >
                      Update every 10th row
                    </button>
                  </div>
                  <div class="col-sm-6 smallpad">
                    <button
                      type="button"
                      class="btn btn-primary btn-block"
                      id="clear"
                      onclick={clear}
                    >
                      Clear
                    </button>
                  </div>
                  <div class="col-sm-6 smallpad">
                    <button
                      type="button"
                      class="btn btn-primary btn-block"
                      id="swaprows"
                      onclick={swapRows}
                    >
                      Swap Rows
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <table class="table table-hover table-striped test-data">
            <tbody id="tbody">
              {store.data.map((row) => (
                <RowComponent
                  key={row.id}
                  row={row}
                  selected={store.selected === row.id}
                  selectSelf={() => selectRow(row.id)}
                  deleteSelf={() => deleteRow(row.id)}
                />
              ))}
            </tbody>
          </table>
          <span
            class="preloadicon glyphicon glyphicon-remove"
            aria-hidden="true"
          ></span>
        </div>
      );
    },
  };
};

function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(() => {
  forgo.mount(<App />, document.getElementById("main"));
});
