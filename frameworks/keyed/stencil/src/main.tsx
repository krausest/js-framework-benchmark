import { Component, State, h } from "@stencil/core";

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    const label = `${adjectives[_random(adjectives.length)]} ${
      colors[_random(colors.length)]
    } ${nouns[_random(nouns.length)]}`;
    data[i] = {
      id: idCounter++,
      label,
    };
  }
  return data;
}

@Component({
  tag: "stencil-app",
})
export class Main {
  @State() data: any[] = [];
  @State() selected: number | undefined;

  constructor() {
    this.select = this.select.bind(this);
    this.delete = this.delete.bind(this);
    this.add = this.add.bind(this);
    this.run = this.run.bind(this);
    this.update = this.update.bind(this);
    this.runLots = this.runLots.bind(this);
    this.clear = this.clear.bind(this);
    this.swapRows = this.swapRows.bind(this);
  }

  run() {
    this.data = buildData(1000);
    this.selected = undefined;
  }
  add() {
    this.data = this.data.concat(buildData(1000));
  }
  update() {
    const newData = this.data.slice(0);

    for (let i = 0; i < newData.length; i += 10) {
      const r = newData[i];

      newData[i] = { id: r.id, label: r.label + " !!!" };
    }
    this.data = newData;
  }
  select(id: number) {
    this.selected = id;
  }
  delete(id) {
    const idx = this.data.findIndex((d) => d.id === id);
    this.data = [...this.data.slice(0, idx), ...this.data.slice(idx + 1)];
  }
  runLots() {
    this.data = buildData(10000);
    this.selected = undefined;
  }
  clear() {
    this.data = [];
    this.selected = undefined;
  }
  swapRows() {
    if (this.data.length > 998) {
      this.data = [
        this.data[0],
        this.data[998],
        ...this.data.slice(2, 998),
        this.data[1],
        this.data[999],
      ];
    }
  }

  render() {
    return (
      <div class="container">
        <div class="jumbotron">
          <div class="row">
            <div class="col-md-6">
              <h1>Stencil Keyed</h1>
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-sm-6 smallpad">
                  <button
                    id="run"
                    class="btn btn-primary btn-block"
                    type="button"
                    onClick={this.run}
                  >
                    Create 1,000 rows
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button
                    id="runlots"
                    class="btn btn-primary btn-block"
                    type="button"
                    onClick={this.runLots}
                  >
                    Create 10,000 rows
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button
                    id="add"
                    class="btn btn-primary btn-block"
                    type="button"
                    onClick={this.add}
                  >
                    Append 1,000 rows
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button
                    id="update"
                    class="btn btn-primary btn-block"
                    type="button"
                    onClick={this.update}
                  >
                    Update every 10th row
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button
                    id="clear"
                    class="btn btn-primary btn-block"
                    type="button"
                    onClick={this.clear}
                  >
                    Clear
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button
                    id="swaprows"
                    class="btn btn-primary btn-block"
                    type="button"
                    onClick={this.swapRows}
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
            {this.data.map((row) => (
              <tr key={row.id} class={row.id === this.selected ? "danger" : ""}>
                <td class="col-md-1">{row.id}</td>
                <td class="col-md-4">
                  <a onClick={() => this.select(row.id)}>{row.label}</a>
                </td>
                <td class="col-md-1">
                  <a onClick={() => this.delete(row.id)}>
                    <span
                      class="glyphicon glyphicon-remove"
                      aria-hidden="true"
                    />
                  </a>
                </td>
                <td class="col-md-6" />
              </tr>
            ))}
          </tbody>
        </table>
        <span
          class="preloadicon glyphicon glyphicon-remove"
          aria-hidden="true"
        />
      </div>
    );
  }
}
