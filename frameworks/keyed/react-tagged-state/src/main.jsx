import { memo }  from "react";
import { render } from "react-dom";
import { createState , observer, compute } from "react-tagged-state";

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

const dataState = createState([]);

const selectedState = createState(0);

const update = (data) => {
  const newData = data.slice();
  let index = 0;
  let length = newData.length;
  let temp;

  for (; index < length; index += 10) {
    temp = newData[index];

    newData[index] = { id: temp.id, label: temp.label + " !!!" };
  }

  return newData;
};

const remove = (item) => (data) => {
  const newData = data.slice();

  newData.splice(data.indexOf(item), 1);

  return newData;
};

const swapRows = (data) => {
  const newData = data.slice();
  const tmp = newData[1];

  newData[1] = newData[998];
  newData[998] = tmp;

  return newData;
};

const Row = memo(observer(({ item }) => (
    <tr className={compute(() => selectedState() === item.id) ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={() => selectedState(item.id)}>{item.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => dataState(remove(item))}><span className="glyphicon glyphicon-remove" aria-hidden="true"/></a>
      </td>
      <td className="col-md-6"/>
    </tr>
)));

const RowList = observer(() => dataState().map((item) => <Row key={item.id} item={item} />));

const Button = ({ id, title, cb }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
  </div>
);

const Main = () => (
  <div className="container">
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6"><h1>React Tagged State </h1></div>
        <div className="col-md-6"><div className="row">
          <Button id="run" title="Create 1,000 rows" cb={() => dataState(buildData(1000))} />
          <Button id="runlots" title="Create 10,000 rows" cb={() => dataState(buildData(10000))} />
          <Button id="add" title="Append 1,000 rows" cb={() => dataState((data) => data.concat(buildData(1000)))} />
          <Button id="update" title="Update every 10th row" cb={() => dataState(update)} />
          <Button id="clear" title="Clear" cb={() => dataState([])} />
          <Button id="swaprows" title="Swap Rows" cb={() => dataState(swapRows)} />
        </div></div>
      </div>
    </div>
    <table className="table table-hover table-striped test-data">
      <tbody>
        <RowList />
      </tbody>
    </table>
    <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"/>
  </div>
);

render(
  <Main />,
  document.getElementById("main")
);
