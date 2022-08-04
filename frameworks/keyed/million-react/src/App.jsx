import { useState } from 'million/react';

const random = (max) => Math.round(Math.random() * 1000) % max;

const A = [
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
];
const C = [
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
];
const N = [
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

let nextId = 1;
const generate = () => {
  return {
    id: nextId++,
    label: `${A[random(A.length)]} ${C[random(C.length)]} ${
      N[random(N.length)]
    }`,
  };
};

export default function App() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(0);

  const clear = () => {
    setSelected(0);
    setList([]);
  };

  const createArray = (count) => {
    const l = [];
    for (let i = 0; i < count; i++) {
      l.push(generate());
    }
    return l;
  };

  const append = (count) => {
    setList((prev) => prev.concat(createArray(count)));
  };

  const create1k = () => {
    setList(createArray(1000));
  };

  const create10k = () => {
    setList(createArray(10000));
  };

  const append1k = () => {
    append(1000);
  };

  const updateEvery10 = () => {
    setList((prev) => {
      const newList = [...prev];
      for (let i = 0; i < prev.length; i += 10) {
        const item = newList[i];
        newList[i] = { id: item.id, label: item.label + ' !!!' };
      }
      return newList;
    });
  };

  const swapRows = () => {
    if (list.length >= 1000) {
      setList((prev) => [
        prev[0],
        prev[998],
        ...prev.slice(2, 998),
        prev[1],
        prev[999],
        ...(list.length > 1000 ? prev.slice(999) : []),
      ]);
    }
  };

  const remove = (id) => setList(list.filter((i) => i.id !== id));

  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>Million React keyed</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-sm-6 smallpad">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  id="run"
                  onClick={create1k}
                >
                  Create 1,000 rows
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  id="runlots"
                  onClick={create10k}
                >
                  Create 10,000 rows
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  id="add"
                  onClick={append1k}
                >
                  Append 1,000 rows
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  id="update"
                  onClick={updateEvery10}
                >
                  Update every 10th row
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  id="clear"
                  onClick={clear}
                >
                  Clear
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  id="swaprows"
                  onClick={swapRows}
                >
                  Swap Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody>
          {list.map((item) => (
            <Row
              key={item.id}
              remove={remove}
              selected={selected}
              setSelected={setSelected}
              item={item}
            />
          ))}
        </tbody>
      </table>
      <span
        className="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      ></span>
    </div>
  );
}

function Row({ item, remove, selected, setSelected }) {
  return (
    <tr className={selected === item.id ? 'danger' : ''}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={() => setSelected(item.id)}>{item.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => remove(item.id)}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td className="col-md-6" />
    </tr>
  );
}
