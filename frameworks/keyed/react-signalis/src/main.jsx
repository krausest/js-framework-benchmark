import { createSignal, useDerived, reactor } from '@signalis/react';
import { createRoot } from 'react-dom/client';

let idCounter = 1;
const adjectives = [
    'pretty',
    'large',
    'big',
    'small',
    'tall',
    'short',
    'long',
    'handsome',
    'plain',
    'quaint',
    'clean',
    'elegant',
    'easy',
    'angry',
    'crazy',
    'helpful',
    'mushy',
    'odd',
    'unsightly',
    'adorable',
    'important',
    'inexpensive',
    'cheap',
    'expensive',
    'fancy',
  ],
  colours = [
    'red',
    'yellow',
    'blue',
    'green',
    'pink',
    'brown',
    'purple',
    'brown',
    'white',
    'black',
    'orange',
  ],
  nouns = [
    'table',
    'chair',
    'house',
    'bbq',
    'desk',
    'car',
    'pony',
    'cookie',
    'sandwich',
    'burger',
    'pizza',
    'mouse',
    'keyboard',
  ];

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: createSignal(
        `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${
          nouns[_random(nouns.length)]
        }`
      ),
    };
  }
  return data;
}

const data = createSignal([]),
  selected = createSignal(null),
  run = () => (data.value = buildData(1000)),
  runLots = () => (data.value = buildData(10000)),
  add = () => (data.value = [...data.value, ...buildData(1000)]),
  update = () => {
    for (let i = 0, d = data.value, len = d.length; i < len; i += 10) d[i].label.value += ' !!!';
  },
  swapRows = () => {
    const d = data.value.slice();
    if (d.length > 998) {
      let tmp = d[1];
      d[1] = d[998];
      d[998] = tmp;
      data.value = d;
    }
  },
  clear = () => (data.value = []),
  select = (id) => (selected.value = id),
  remove = (id) => {
    const d = data.value;
    const idx = d.findIndex((d) => d.id === id);
    data.value = [...d.slice(0, idx), ...d.slice(idx + 1)];
  };

const Button = ({ id, text, fn }) => (
  <div className="col-sm-6 smallpad">
    <button id={id} className="btn btn-primary btn-block" type="button" onClick={fn}>
      {text}
    </button>
  </div>
);

const Row = reactor(({ row }) => {
  const className = useDerived(() => (selected.value === row.id ? 'danger' : ''));
  return (
    <tr className={className.value}>
      <td className="col-md-1">{row.id}</td>
      <td className="col-md-4">
        <a onClick={() => select(row.id)}>{row.label.value}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => remove(row.id)}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />
        </a>
      </td>
      <td className="col-md-6" />
    </tr>
  );
});

const TableBody = reactor(({ data }) => {
  return data.value.map((d) => <Row key={d.id} row={d} />);
});

const App = () => {
  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React + Signalis - Keyed</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
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
      <table className="table table-hover table-striped test-data">
        <tbody>
          <TableBody data={data} />
        </tbody>
      </table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
};

createRoot(document.getElementById('main')).render(<App />);
