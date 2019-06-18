import React, { useCallback } from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";

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

const store = createStore((state = { data: [], selected: 0 }, action) => {
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
      const newData = data.slice();
      newData.splice(data.indexOf(action.item), 1);
      return { data: newData, selected };
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
});

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = React.memo(({ data }) => {
  const isSelected = useSelector((state) => state.selected === data.id, [data]);
  const dispatch = useDispatch();
  const select = useCallback(() => { dispatch({ type: "SELECT", id: data.id }); }, [data]);
  const remove = useCallback(() => { dispatch({ type: "REMOVE", item: data }); }, [data]);
  return (
    <tr className={isSelected ? "danger" : ""}>
      <td className="col-md-1">{data.id}</td>
      <td className="col-md-4"><a onClick={select}>{data.label}</a></td>
      <td className="col-md-1"><a onClick={remove}>{GlyphIcon}</a></td>
      <td className="col-md-6"></td>
    </tr>
  )
});

const RowList = React.memo(() => {
  const rows = useSelector((state) => state.data);
  return rows.map((data) => <Row key={data.id} data={data} />);
});

const Button = React.memo(({ id, title, cb }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
  </div>
));

const Main = () => {
  const dispatch = useDispatch();
  const run = useCallback(() => { dispatch({ type: "RUN" }); }, []);
  const runLots = useCallback(() => { dispatch({ type: "RUN_LOTS" }); }, []);
  const add = useCallback(() => { dispatch({ type: "ADD" }); }, []);
  const update = useCallback(() => { dispatch({ type: "UPDATE" }); }, []);
  const clear = useCallback(() => { dispatch({ type: "CLEAR" }); }, []);
  const swapRows = useCallback(() => { dispatch({ type: "SWAP_ROWS" }); }, []);
  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6"><h1>React + Redux</h1></div>
          <div className="col-md-6"><div className="row">
            <Button id="run" title="Create 1,000 rows" cb={run} />
            <Button id="runlots" title="Create 10,000 rows" cb={runLots} />
            <Button id="add" title="Append 1,000 rows" cb={add} />
            <Button id="update" title="Update every 10th row" cb={update} />
            <Button id="clear" title="Clear" cb={clear} />
            <Button id="swaprows" title="Swap Rows" cb={swapRows} />
          </div></div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data"><tbody><RowList /></tbody></table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}><Main /></Provider>,
  document.getElementById("main")
);
