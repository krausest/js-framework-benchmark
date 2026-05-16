import { useState } from "preact/hooks";
import { h } from "preact";

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

const buildData = (count) => {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }
  return data;
};

const Button = ({ id, text, fn }) => (
  <div class="col-sm-6 smallpad">
    <button id={id} class="btn btn-primary btn-block" type="button" onClick={fn}>
      {text}
    </button>
  </div>
);

export default function App() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);

  const run = () => {
    setData(buildData(1000));
    setSelected(null);
  };
  const runLots = () => {
    setData(buildData(10000));
    setSelected(null);
  };
  const add = () => setData((d) => [...d, ...buildData(1000)]);
  const update = () => {
    const newData = data.slice(0);
    for (let i = 0; i < newData.length; i += 10) {
      newData[i] = { id: newData[i].id, label: newData[i].label + " !!!" };
    }
    setData(newData);
  };
  const clear = () => {
    setData([]);
    setSelected(null);
  };
  const swapRows = () => {
    const d = data.slice();
    if (d.length > 998) {
      const tmp = d[1];
      d[1] = d[998];
      d[998] = tmp;
      setData(d);
    }
  };
  const remove = (id) => setData((d) => d.filter((r) => r.id !== id));

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Astro-preact-keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" text="Create 1,000 rows" fn={run} />
              <Button id="runlots" text="Create 10,000 rows" fn={runLots} />
              <Button id="add" text="Append 1,000 rows" fn={add} />
              <Button id="update" text="Update every 10th row" fn={update} />
              <Button id="clear" text="Clear" fn={clear} />
              <Button id="swaprows" text="Swap Rows" fn={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          {data.map((row) => (
            <tr key={row.id} class={selected === row.id ? "danger" : ""}>
              <td class="col-md-1">{row.id}</td>
              <td class="col-md-4">
                <a onClick={() => setSelected(row.id)}>{row.label}</a>
              </td>
              <td class="col-md-1">
                <a onClick={() => remove(row.id)}>
                  <span class="glyphicon glyphicon-remove" aria-hidden="true" />
                </a>
              </td>
              <td class="col-md-6" />
            </tr>
          ))}
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
}
