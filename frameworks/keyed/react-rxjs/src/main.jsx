import React from "react";
import { createRoot } from 'react-dom/client';
import { Subject } from "rxjs";
import { scan } from "rxjs/operators";
import { state, useStateObservable } from "@react-rxjs/core";

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
const C = [
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
];
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

const random = (max) => Math.round(Math.random() * 1000) % max;

let nextId = 1;
function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    const id = nextId++;
    data[i] = {
      id,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${
        N[random(N.length)]
      }`,
    };
  }
  return data;
}

const rowEvents$ = new Subject();
const onReset = (payload) => rowEvents$.next({ type: "reset", payload });
const onAdd = () => rowEvents$.next({ type: "add" });
const onUpdate = () => rowEvents$.next({ type: "update" });
const onClear = () => rowEvents$.next({ type: "clear" });
const onSwap = () => rowEvents$.next({ type: "swap" });
const onRemove = (payload) => rowEvents$.next({ type: "remove", payload });

const init = [];
const items$ = state(
  rowEvents$.pipe(
    scan((data, action) => {
      switch (action.type) {
        case "reset":
          return buildData(action.payload);
        case "add":
          return data.concat(buildData(1000));
        case "update": {
          const newData = data.slice();
          for (let i = 0; i < newData.length; i += 10) {
            const r = newData[i];
            newData[i] = { id: r.id, label: r.label + " !!!" };
          }
          return newData;
        }
        case "remove": {
          const newData = data.slice();
          newData.splice(data.indexOf(action.payload), 1);
          return newData;
        }
        case "clear":
          return init;
        case "swap": {
          const newData = data.slice();
          const tmp = newData[1];
          newData[1] = newData[998];
          newData[998] = tmp;
          return newData;
        }
      }
    }, init)
  ),
  init
);

const selected$ = new Subject();
const onSelect = (id) => {
  selected$.next(id);
};
const selectedId$ = state(selected$, 0);

const GlyphIcon = (
  <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
);

const Row = React.memo(({ item, isSelected }) => {
  return (
    <tr className={isSelected ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={() => onSelect(item.id)}>{item.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => onRemove(item)}>{GlyphIcon}</a>
      </td>
      <td className="col-md-6"></td>
    </tr>
  );
});

const RowList = () => {
  const rows = useStateObservable(items$);
  const selecteId = useStateObservable(selectedId$);
  return rows.map((item) => (
    <Row key={item.id} item={item} isSelected={selecteId === item.id} />
  ));
};

const Button = ({ id, title, cb }) => (
  <div className="col-sm-6 smallpad">
    <button
      type="button"
      className="btn btn-primary btn-block"
      id={id}
      onClick={cb}
    >
      {title}
    </button>
  </div>
);

const Main = () => (
  <div className="container">
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6">
          <h1>React + react-rxjs</h1>
        </div>
        <div className="col-md-6">
          <div className="row">
            <Button
              id="run"
              title="Create 1,000 rows"
              cb={() => onReset(1000)}
            />
            <Button
              id="runlots"
              title="Create 10,000 rows"
              cb={() => onReset(10000)}
            />
            <Button id="add" title="Append 1,000 rows" cb={onAdd} />
            <Button id="update" title="Update every 10th row" cb={onUpdate} />
            <Button id="clear" title="Clear" cb={onClear} />
            <Button id="swaprows" title="Swap Rows" cb={onSwap} />
          </div>
        </div>
      </div>
    </div>
    <table className="table table-hover table-striped test-data">
      <tbody>
        <RowList />
      </tbody>
    </table>
    <span
      className="preloadicon glyphicon glyphicon-remove"
      aria-hidden="true"
    ></span>
  </div>
);

createRoot(document.getElementById("main")).render(<Main />);
