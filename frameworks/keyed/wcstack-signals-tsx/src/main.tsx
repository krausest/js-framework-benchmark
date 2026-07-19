import { h, For, signal, createRoot, render } from "@wcstack/signals/dom";
import type { WriteSignal } from "@wcstack/signals/dom";

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

function random(max: number): number {
  return Math.round(Math.random() * 1000) % max;
}

interface RowData {
  readonly id: number;
  readonly label: WriteSignal<string>;
}

let nextId = 1;

function buildData(count: number): RowData[] {
  const data = new Array<RowData>(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: signal(`${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`),
    };
  }
  return data;
}

const data = signal<RowData[]>([]);
const selected = signal(0);

const run = () => {
  data.set(buildData(1000));
  selected.set(0);
};
const runLots = () => {
  data.set(buildData(10000));
  selected.set(0);
};
const add = () => {
  data.set(data.peek().concat(buildData(1000)));
};
const update = () => {
  const d = data.peek();
  for (let i = 0; i < d.length; i += 10) {
    d[i].label.set(d[i].label.peek() + " !!!");
  }
};
const clear = () => {
  data.set([]);
  selected.set(0);
};
const swapRows = () => {
  const d = data.peek();
  if (d.length > 998) {
    const copy = d.slice();
    [copy[1], copy[998]] = [copy[998], copy[1]];
    data.set(copy);
  }
};
const select = (id: number) => {
  selected.set(id);
};
const remove = (id: number) => {
  const d = data.peek();
  data.set(d.toSpliced(d.findIndex((row) => row.id === id), 1));
};

interface ButtonProps {
  id: string;
  text: string;
  onClick: () => void;
}

const Button = ({ id, text, onClick }: ButtonProps) => (
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" id={id} onClick={onClick}>
      {text}
    </button>
  </div>
);

const Row = (row: RowData) => (
  <tr class={() => (selected.get() === row.id ? "danger" : "")}>
    <td class="col-md-1">{String(row.id)}</td>
    <td class="col-md-4">
      <a onClick={() => select(row.id)}>{() => row.label.get()}</a>
    </td>
    <td class="col-md-1">
      <a onClick={() => remove(row.id)}>
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
);

const Main = () => (
  <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>wcstack-signals-tsx-"keyed"</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <Button id="run" text="Create 1,000 rows" onClick={run} />
            <Button id="runlots" text="Create 10,000 rows" onClick={runLots} />
            <Button id="add" text="Append 1,000 rows" onClick={add} />
            <Button id="update" text="Update every 10th row" onClick={update} />
            <Button id="clear" text="Clear" onClick={clear} />
            <Button id="swaprows" text="Swap Rows" onClick={swapRows} />
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped test-data">
      <tbody>{For(data, Row, { key: (row) => row.id })}</tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>
);

createRoot(() => {
  render(<Main />, document.getElementById("main")!);
});
