import React, { memo, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

function random(max) { return Math.round(Math.random() * 1000) % max; }

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }
  return data;
}

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = memo(({ selected, item, select, remove }) =>
  <tr className={selected ? "danger" : ""}>
    <td className="col-md-1">{item.id}</td>
    <td className="col-md-4"><a onClick={() => select(item)}>{item.label}</a></td>
    <td className="col-md-1"><a onClick={() => remove(item)}>{GlyphIcon}</a></td>
    <td className="col-md-6"></td>
  </tr>
);

const Button = ({ id, cb, title }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
  </div>
);

const Jumbotron = memo(({ setState }) => {
  const run = () => setState({ data: buildData(1000), selected: 0 }),

    runLots = () => setState({ data: buildData(10000), selected: 0 }),

    add = () => setState(({ data, selected }) => ({ data: data.concat(buildData(1000)), selected })),

    update = () => setState(({ data, selected }) => {
      for (let i = 0; i < data.length; i += 10) {
        const item = data[i];
        data[i] = { id: item.id, label: item.label + ' !!!' };
      }
      return { data, selected };
    }),

    clear = () => setState({ data: [], selected: 0 }),

    swapRows = () => {
      setState(({ data, selected }) => ({ data: [data[0], data[998], ...data.slice(2, 998), data[1], data[999]], selected }))
    };

  return (<div className="jumbotron">
    <div className="row">
      <div className="col-md-6">
        <h1>React Hooks keyed</h1>
      </div>
      <div className="col-md-6">
        <div className="row">
          <Button id="run" title="Create 1,000 rows" cb={run} />
          <Button id="runlots" title="Create 10,000 rows" cb={runLots} />
          <Button id="add" title="Append 1,000 rows" cb={add} />
          <Button id="update" title="Update every 10th row" cb={update} />
          <Button id="clear" title="Clear" cb={clear} />
          <Button id="swaprows" title="Swap Rows" cb={swapRows} />
        </div>
      </div>
    </div>
  </div>);
}, () => true);

const Main = () => {
  const [state, setState] = useState({ data: [], selected: 0 }),

    select = useCallback(item => setState(({ data }) => ({ data, selected: item.id })), []),

    remove = useCallback(item => setState(({ data, selected }) => {
      const idx = data.indexOf(item);
      return { data: [...data.slice(0, idx), ...data.slice(idx + 1)], selected };
    }), []);

  return (<div className="container">
    <Jumbotron setState={setState} />
    <table className="table table-hover table-striped test-data"><tbody>
      {state.data.map(item => (
        <Row key={item.id} item={item} selected={state.selected === item.id} select={select} remove={remove} />
      ))}
    </tbody></table>
    <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>);
}

ReactDOM.render(<Main />, document.getElementById('main'));
