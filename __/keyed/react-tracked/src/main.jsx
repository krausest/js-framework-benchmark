import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import { createContainer, memo } from "react-tracked";

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

const initialState = { data: [], selected: 0 };
const reducer = (state, action) => {
  const { data, selected } = state;
  switch (action.type) {
    case "RUN":
      return { data: buildData(1000), selected: 0 };
    case "RUN_LOTS":
      return { data: buildData(10000), selected: 0 };
    case "ADD":
      return { data: data.concat(buildData(1000)), selected };
    case "UPDATE": {
      const newData = data.slice();
      for (let i = 0; i < newData.length; i += 10) {
        const r = newData[i];
        newData[i] = { id: r.id, label: r.label + " !!!" };
      }
      return { data: newData, selected };
    }
    case "REMOVE": {
      const idx = data.findIndex((d) => d.id === action.id);
      return { data: [...data.slice(0, idx), ...data.slice(idx + 1)], selected };
    }
    case "SELECT":
      return { data, selected: action.id };
    case "CLEAR":
      return { data: [], selected: 0 };
    case "SWAP_ROWS": {
      const newData = data.slice();
      const tmp = newData[1];
      newData[1] = newData[998];
      newData[998] = tmp;
      return { data: newData, selected };
    }
  }
  return state;
};

const useValue = () => useReducer(reducer, initialState);
const { Provider, useTrackedState, useUpdate: useDispatch } = createContainer(useValue);

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = memo(({ item, isSelected }) => {
  const dispatch = useDispatch();
  return (
    <tr className={isSelected ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4"><a onClick={() => dispatch({ type: "SELECT", id: item.id })}>{item.label}</a></td>
      <td className="col-md-1"><a onClick={() => dispatch({ type: "REMOVE", id: item.id })}>{GlyphIcon}</a></td>
      <td className="col-md-6"></td>
    </tr>
  )
});

const RowList = memo(() => {
  const { data, selected } = useTrackedState();
  return data.map((item) => <Row key={item.id} item={item} isSelected={selected === item.id} />);
});

const Button = memo(({ id, title, cb }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
  </div>
));

const Main = () => {
  const dispatch = useDispatch();
  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6"><h1>React Tracked</h1></div>
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
  <Provider><Main /></Provider>,
  document.getElementById("main")
);
