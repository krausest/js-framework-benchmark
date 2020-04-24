import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, createEvent, sample } from "effector";
import { useList, useStoreMap } from "effector-react";

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

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

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${
        N[random(N.length)]
      }`,
    };
  }
  return data;
}

const GlyphIcon = (
  <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
);

class Row extends React.Component {
  onSelect = () => {
    this.props.select(this.props.item);
  };

  onRemove = () => {
    this.props.remove(this.props.item);
  };

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.item !== this.props.item ||
      nextProps.selected !== this.props.selected
    );
  }

  render() {
    let { selected, item } = this.props;
    return (
      <tr className={selected ? "danger" : ""}>
        <td className="col-md-1">{item.id}</td>
        <td className="col-md-4">
          <a onClick={this.onSelect}>{item.label}</a>
        </td>
        <td className="col-md-1">
          <a onClick={this.onRemove}>{GlyphIcon}</a>
        </td>
        <td className="col-md-6"></td>
      </tr>
    );
  }
}

function Button({ id, cb, title }) {
  return (
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
}

class Jumbotron extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { run, runLots, add, update, clear, swapRows } = this.props;
    return (
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React keyed</h1>
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
    );
  }
}

const $data = createStore([]);
const $selected = createStore(0);

const run = createEvent();
const runLots = createEvent();
const add = createEvent();
const update = createEvent();
const select = createEvent(); // item
const remove = createEvent(); // item
const clear = createEvent();
const swapRows = createEvent();

$data
  .on(run, () => buildData(1000))
  .on(runLots, () => buildData(10000))
  .on(add, (list) => list.concat(buildData(1000)))
  .on(update, (list) => {
    const data = list.concat([]); // to change ref to arrays
    for (let i = 0; i < data.length; i += 10) {
      const item = data[i];
      data[i] = { id: item.id, label: item.label + " !!!" };
    }
    return data;
  })
  .on(remove, (list, item) => {
    const data = list.concat([]); // to change ref
    data.splice(data.indexOf(item), 1);
    return data;
  })
  .on(clear, () => [])
  .on(swapRows, (list) => {
    const data = list.concat([]); // to change ref
    if (data.length > 998) {
      let temp = data[1];
      data[1] = data[998];
      data[998] = temp;
    }
    return data;
  });

// @ts-ignore
$selected.on(select, (_, item) => item.id).on(clear, () => 0);

function Main() {
  return (
    <div className="container">
      <Jumbotron
        run={run}
        runLots={runLots}
        add={add}
        update={update}
        clear={clear}
        swapRows={swapRows}
      />
      <table className="table table-hover table-striped test-data">
        <tbody>
          {useList($data, (item) => {
            const isSelected = useStoreMap({
              store: $selected,
              keys: [item.id],
              fn: (selected, [id]) => selected === id,
            });
            return (
              <Row
                key={item.id}
                item={item}
                selected={isSelected}
                select={select}
                remove={remove}
              ></Row>
            );
          })}
        </tbody>
      </table>
      <span
        className="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      ></span>
    </div>
  );
}

ReactDOM.render(<Main />, document.getElementById("main"));
