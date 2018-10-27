import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    }
  }
  return data;
}

const store = createStore((state = { data: [], selected: 0 }, action) => {
  const { data, selected } = state;
  switch (action.type) {
    case 'RUN':
      return { data: buildData(1000), selected: 0 };
    case 'RUN_LOTS':
      return { data: buildData(10000), selected: 0 };
    case 'ADD':
      return { data: data.concat(buildData(1000)), selected };
    case 'UPDATE':
      const newData = data.slice();
      for (let i = 0; i < newData.length; i += 10) {
        const r = newData[i];
        newData[i] = { id: r.id, label: r.label + " !!!" };
      }
      return { data: newData, selected };
    case 'REMOVE':
      const idx = data.findIndex((d) => d.id === action.id);
      return { data: [...data.slice(0, idx), ...data.slice(idx + 1)], selected };
    case 'SELECT':
      return { data, selected: action.id };
    case 'CLEAR':
      return { data: [], selected: 0 };
    case 'SWAP_ROWS':
      return { data: [data[0], data[998], ...data.slice(2, 998), data[1], data[999]], selected };
  }
  return state;
});

function select(id) {
  return { type: 'SELECT', id };
}

function remove(id) {
  return { type: 'REMOVE', id };
}

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = connect(
  (state, { i }) => {
    const item = state.data[i];
    return state.selected === item.id ? { id: item.id, label: item.label, selected: true } : item;
  },
  { select, remove },
)(class extends React.Component {
  onSelect = () => {
    this.props.select(this.props.id);
  };

  onRemove = () => {
    this.props.remove(this.props.id);
  };

  render() {
    const { selected, id, label } = this.props;
    return (
      <tr className={selected ? "danger" : ""}>
        <td className="col-md-1">{id}</td>
        <td className="col-md-4"><a onClick={this.onSelect}>{label}</a></td>
        <td className="col-md-1"><a onClick={this.onRemove}>{GlyphIcon}</a></td>
        <td className="col-md-6"></td>
      </tr>
    );
  }
});

const RowList = connect(
  (state) => ({ data: state.data }),
  null,
  null,
  {
    areStatesEqual: (prev, next) => prev.data === next.data,
  },
)(({ data }) => data.map((item, i) => <Row key={item.id} i={i} />));

function Button(props) {
  return (
    <div className="col-sm-6 smallpad">
      <button type="button" className="btn btn-primary btn-block" id={props.id} onClick={props.cb}>{props.title}</button>
    </div>
  );
}

const Main = connect(
  null,
  {
    run: () => ({ type: 'RUN' }),
    runLots: () => ({ type: 'RUN_LOTS' }),
    add: () => ({ type: 'ADD' }),
    update: () => ({ type: 'UPDATE' }),
    clear: () => ({ type: 'CLEAR' }),
    swapRows: () => ({ type: 'SWAP_ROWS' }),
  },
)((props) => (
  <div className="container">
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6">
          <h1>React + Redux</h1>
        </div>
        <div className="col-md-6">
          <div className="row">
            <Button id="run" title="Create 1,000 rows" cb={props.run} />
            <Button id="runlots" title="Create 10,000 rows" cb={props.runLots} />
            <Button id="add" title="Append 1,000 rows" cb={props.add} />
            <Button id="update" title="Update every 10th row" cb={props.update} />
            <Button id="clear" title="Clear" cb={props.clear} />
            <Button id="swaprows" title="Swap Rows" cb={props.swapRows} />
          </div>
        </div>
      </div>
    </div>
    <table className="table table-hover table-striped test-data"><tbody><RowList /></tbody></table>
    <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>
));

ReactDOM.render(
  (
    <Provider store={store}>
      <Main />
    </Provider>
  ),
  document.getElementById("main")
);
