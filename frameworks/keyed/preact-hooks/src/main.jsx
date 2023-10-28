import { useState } from "preact/hooks";
import { memo } from "preact/compat";
import { render, h } from "preact";

let idCounter = 1;
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
  ],
  C = [
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
  ],
  N = [
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

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count) {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: `${A[_random(A.length)]} ${C[_random(C.length)]} ${
        N[_random(N.length)]
      }`,
    };
  }

  return data;
}

const Button = ({ id, text, fn }) => (
  <div class="col-sm-6 smallpad">
    <button
      id={id}
      class="btn btn-primary btn-block"
      type="button"
      onClick={fn}
    >
      {text}
    </button>
  </div>
);

const App = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);

  const run = () => {
    console.log("RUN");
    setData(buildData(1000));
  };

  const runLots = () => {
    setData(buildData(10000));
  };

  const add = () => {
    setData((prevData) => [...prevData, ...buildData(1000)]);
  };

  const update = () => {
    const newData = data.slice(0);

    for (let i = 0, d = data, len = d.length; i < len; i += 10) {
      newData[i] = { id: data[i].id, label: data[i].label + " !!!" };
    }

    setData(newData);
  };

  const swapRows = () => {
    const d = data.slice();
    if (d.length > 998) {
      let tmp = d[1];
      d[1] = d[998];
      d[998] = tmp;
      setData(d);
    }
  };

  const clear = () => {
    setData([]);
  };

  const remove = (id) => {
    setData((prevData) => prevData.filter((d) => d.id !== id));
  };

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Preact Hooks Keyed</h1>
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
          {data.map((item) => (
            <Row
              key={item.id}
              item={item}
              selected={selected === item.id}
              setSelected={setSelected}
              remove={remove}
            />
          ))}
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
};

const Row = memo(
  ({ item, selected, remove, setSelected }) => (
    <tr className={selected ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={() => setSelected(item.id)}>{item.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => remove(item.id)}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />
        </a>
      </td>
      <td className="col-md-6" />
    </tr>
  ),
  (prevProps, nextProps) => prevProps.selected === nextProps.selected && prevProps.item === nextProps.item
);

render(<App />, document.getElementById("main"));
