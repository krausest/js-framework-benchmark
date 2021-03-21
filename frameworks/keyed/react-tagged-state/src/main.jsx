import React  from "react";
import ReactDOM from "react-dom";
import {createTagged, useSelector, useTagged} from "react-tagged-state";

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

const random = (max) => Math.round(Math.random() * 1000) % max;

let nextId = 1;

const buildData = (count) => {
  const res = [];
  let index = 0;

  for (; index < count; ++index) {
    res.push({
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`
    })
  }

  return res;
}

const dataState = createTagged([]);
const selectionState = createTagged(0);

const run = () => {
  dataState(buildData(1000));
  selectionState(0);
};
const runLots = () => {
  dataState(buildData(10000));
  selectionState(0);
};
const add = () => {
  dataState((data) => [...data, ...buildData(1000)]);
};
const update = () => {
  dataState((data) => {
    const newData = [...data];
    let index = 0;
    let length = newData.length;
    let temp;

    for (; index < length; index += 10) {
      temp = newData[index];

      newData[index] = { id: temp.id, label: temp.label + " !!!" };
    }

    return newData;
  });
};
const remove = (item) => {
  dataState((data) => {
    const newData = [...data];

    newData.splice(data.indexOf(item), 1);

    return newData;
  });
};
const select = (id) => {
  selectionState(id);
};
const clear = () => {
  dataState([]);
  selectionState(0);
};
const swapRows = () => {
  dataState((data) => {
    const newData = [...data];
    const tmp = newData[1];

    newData[1] = newData[998];
    newData[998] = tmp;

    return newData;
  });
};


const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"/>;

const Row = React.memo(({ data }) => {
  const isSelected = useSelector(() => selectionState() === data.id);

  return (
      <tr className={isSelected ? "danger" : ""}>
        <td className="col-md-1">{data.id}</td>
        <td className="col-md-4"><a onClick={() => select(data.id)}>{data.label}</a></td>
        <td className="col-md-1"><a onClick={() => remove(data)}>{GlyphIcon}</a></td>
        <td className="col-md-6"/>
      </tr>
  )
});

const RowList = React.memo(() => {
  useTagged();

  return dataState().map((data) => <Row key={data.id} data={data} />);
});

const Button = React.memo(({ id, title, cb }) => (
    <div className="col-sm-6 smallpad">
      <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
    </div>
));

const Main = () => (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6"><h1>React Tagged State </h1></div>
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
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"/>
    </div>
);

ReactDOM.render(
    <Main />,
    document.getElementById("main")
);
