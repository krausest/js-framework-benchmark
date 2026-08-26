import { signal, batch, untrack } from "@deijose/nix-js/signals";
import { html, repeat } from "@deijose/nix-js/template";
import { mount } from "@deijose/nix-js/component";
import type { Signal } from "@deijose/nix-js/signals";

interface Row {
  id: number;
  label: Signal<string>;
}

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random(max: number): number {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count = 1000): Row[] {
  const data: Row[] = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: signal(`${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`),
    };
  }
  return data;
}

function App() {
  const rows = signal<Row[]>([]);
  const selected = signal<number | undefined>(undefined);

  function setRows(newRows: Row[]): void {
    rows.value = newRows;
  }

  function run(): void {
    setRows(buildData(1000));
    selected.value = undefined;
  }

  function runLots(): void {
    setRows(buildData(10000));
    selected.value = undefined;
  }

  function add(): void {
    rows.value = untrack(() => rows.value).concat(buildData(1000));
  }

  function update(): void {
    batch(() => {
      const r = rows.value;
      for (let i = 0; i < r.length; i += 10) {
        r[i].label.value += " !!!";
      }
    });
  }

  function clear(): void {
    setRows([]);
    selected.value = undefined;
  }

  function swapRows(): void {
    const r = untrack(() => rows.value);
    if (r.length > 998) {
      const d1 = r[1];
      const d998 = r[998];
      r[1] = d998;
      r[998] = d1;
      setRows(r.slice());
    }
  }

  function select(id: number): void {
    selected.value = id;
  }

  function removeRow(id: number): void {
    const r = untrack(() => rows.value);
    const idx = r.findIndex((d) => d.id === id);
    if (idx !== -1) {
      r.splice(idx, 1);
      setRows(r.slice());
    }
  }

  return html`
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Nix.js (keyed)</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="run" @click=${run}>Create 1,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="runlots" @click=${runLots}>Create 10,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="add" @click=${add}>Append 1,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="update" @click=${update}>Update every 10th row</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="clear" @click=${clear}>Clear</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="swaprows" @click=${swapRows}>Swap Rows</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          ${() => repeat(
    rows.value,
    (row) => row.id,
    (row) => html`
              <tr class=${() => row.id === selected.value ? "danger" : ""}>
                <td class="col-md-1">${row.id}</td>
                <td class="col-md-4">
                  <a @click=${() => select(row.id)}>${() => row.label.value}</a>
                </td>
                <td class="col-md-1">
                  <a @click=${() => removeRow(row.id)}>
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                  </a>
                </td>
                <td class="col-md-6"></td>
              </tr>
            `
  )}
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  `;
}

mount(App(), "#main");
