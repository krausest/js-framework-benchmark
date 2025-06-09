import React, { memo } from "react";
import { createRoot } from "react-dom/client";
import Onyx, { useOnyx } from "react-native-onyx";

const ONYXKEYS = {
  COLLECTION: {
    OBJECT: "OBJECT_",
  },
};

const config = {
  keys: ONYXKEYS,
};

Onyx.init(config);

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
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
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
  let data = {};
  for (let i = 0; i < count; i++) {
    const id = nextId++;
    data[`${ONYXKEYS.COLLECTION.OBJECT}${id}`] = {
      id,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }
  return data;
}

let selectedItem = undefined;

let object = {};
Onyx.connect({
  key: ONYXKEYS.COLLECTION.OBJECT,
  waitForCollectionCallback: true,
  callback: (val, ...x) => {
    if (!val) {
      return;
    }

    object = val;
  },
});

function run() {
  Onyx.setCollection(ONYXKEYS.COLLECTION.OBJECT, buildData(1000));
}
function runLots() {
  Onyx.setCollection(ONYXKEYS.COLLECTION.OBJECT, buildData(10000));
}
function add() {
  Onyx.mergeCollection(ONYXKEYS.COLLECTION.OBJECT, buildData(1000));
}
function update() {
  const arr = Object.values(object);

  const updates = {};
  for (let i = 0; i < arr.length; i += 10) {
    const item = arr[i];
    if (!item) {
      continue;
    }

    updates[`${ONYXKEYS.COLLECTION.OBJECT}${item.id}`] = {
      ...item,
      label: item.label + " !!!",
    };
  }

  Onyx.mergeCollection(ONYXKEYS.COLLECTION.OBJECT, updates);
}
function remove(itemData) {
  Onyx.set(`${ONYXKEYS.COLLECTION.OBJECT}${itemData.id}`, null);
}
function select(item) {
  const newSelectedItem = { ...item, selected: true };
  if (selectedItem) {
    Onyx.set(`${ONYXKEYS.COLLECTION.OBJECT}${selectedItem.id}`, { ...selectedItem, selected: false });
  }
  Onyx.set(`${ONYXKEYS.COLLECTION.OBJECT}${item.id}`, newSelectedItem);
  selectedItem = newSelectedItem;
}
function swapRows() {
  const array = Object.values(object);
  const firstRow = { ...array[1] };
  const lastRow = { ...array[998] };

  Onyx.mergeCollection(ONYXKEYS.COLLECTION.OBJECT, {
    [`${ONYXKEYS.COLLECTION.OBJECT}${firstRow.id === 2 ? firstRow.id : lastRow.id}`]: lastRow,
    [`${ONYXKEYS.COLLECTION.OBJECT}${lastRow.id === 999 ? lastRow.id : firstRow.id}`]: firstRow,
  });
}
function clear() {
  Onyx.clear();
}

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = ({ item }) => {
  const { label, selected, id } = item;

  return (
    <tr className={selected ? "danger" : ""}>
      <td className="col-md-1">{id}</td>
      <td className="col-md-4">
        <a onClick={() => select(item)}>{label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => remove(item)}>{GlyphIcon}</a>
      </td>
      <td className="col-md-6"></td>
    </tr>
  );
};

const Button = memo(({ id, title, cb }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>
      {title}
    </button>
  </div>
));

const Main = () => {
  const [obj = {}] = useOnyx(ONYXKEYS.COLLECTION.OBJECT);

  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React Native Onyx v2.0.108</h1>
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
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody>
          {Object.values(obj).map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </tbody>
      </table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  );
};

createRoot(document.getElementById("main")).render(<Main />, document.getElementById("main"));
