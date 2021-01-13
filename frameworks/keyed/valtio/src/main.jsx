import React, { memo, useReducer } from "react";
import ReactDOM from "react-dom";
import { proxy, useProxy } from "valtio";

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

const random = (max) => Math.round(Math.random() * 1000) % max;

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

const state = proxy({ data: [], selected: 0 });
const dispatch = (action) => {
  switch (action.type) {
    case "RUN":
      state.data = buildData(1000);
      state.selected = 0;
      break;
    case "RUN_LOTS":
      state.data = buildData(10000);
      state.selected = 0;
      break;
    case "ADD":
      state.data = state.data.concat(buildData(1000));
      state.selected = 0;
      break;
    case "UPDATE": {
      for (let i = 0; i < state.data.length; i += 10) {
        const r = state.data[i];
        state.data[i] = { id: r.id, label: r.label + " !!!" };
      }
      break;
    }
    case "REMOVE": {
      const idx = state.data.findIndex((d) => d.id === action.id);
      state.data.splice(idx, 1);
      break;
    }
    case "SELECT":
      state.selected = action.id;
      break;
    case "CLEAR":
      state.data = [];
      state.selected = 0;
      break;
    case "SWAP_ROWS": {
      const tmp = state.data[1];
      state.data[1] = state.data[998];
      state.data[998] = tmp;
      break;
    }
  }
};

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = memo(({ id, label, isSelected }) => {
  return (
    <tr className={isSelected ? "danger" : ""}>
      <td className="col-md-1">{id}</td>
      <td className="col-md-4"><a onClick={() => dispatch({ type: "SELECT", id })}>{label}</a></td>
      <td className="col-md-1"><a onClick={() => dispatch({ type: "REMOVE", id })}>{GlyphIcon}</a></td>
      <td className="col-md-6"></td>
    </tr>
  )
});

const RowList = memo(() => {
  const { data, selected } = useProxy(state);
  return data.map((item) => <Row key={item.id} id={item.id} label={item.label} isSelected={selected === item.id} />);
});

const Button = memo(({ id, title, cb }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
  </div>
));

const Main = () => {
  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6"><h1>Valtio</h1></div>
          <div className="col-md-6"><div className="row">
            <Button id="run" title="Create 1,000 rows" cb={() => dispatch({ type: "RUN" })} />
            <Button id="runlots" title="Create 10,000 rows" cb={() => dispatch({ type: "RUN_LOTS" })} />
            <Button id="add" title="Append 1,000 rows" cb={() => dispatch({ type: "ADD" })} />
            <Button id="update" title="Update every 10th row" cb={() => dispatch({ type: "UPDATE" })} />
            <Button id="clear" title="Clear" cb={() => dispatch({ type: "CLEAR" })} />
            <Button id="swaprows" title="Swap Rows" cb={() => dispatch({ type: "SWAP_ROWS" })} />
          </div></div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data"><tbody><RowList /></tbody></table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  );
};

ReactDOM.render(
  <Main />,
  document.getElementById("main")
);
