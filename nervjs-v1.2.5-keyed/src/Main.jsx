"use strict";

const React = require("nervjs");
const { render, createElement, Component } = React;
const { Store } = require("./Store");

var startTime;
var lastMeasure;
var startMeasure = function(name) {
  //console.timeStamp(name);
  startTime = performance.now();
  lastMeasure = name;
};
var stopMeasure = function() {
  var last = lastMeasure;
  if (lastMeasure) {
    window.setTimeout(function() {
      lastMeasure = null;
      var stop = performance.now();
      var duration = 0;
      console.log(last + " took " + (stop - startTime));
    }, 0);
  }
};

function shouldRowUpdate(prevProps, nextProps) {
  return (
    prevProps.data !== nextProps.data ||
    nextProps.selected !== prevProps.selected
  );
}

function selectOnClick(onSelect, id) {
  return () => {
    console.log(id);
    onSelect(id);
  };
}

function deleteOnClick(onDetele, id) {
  return () => onDetele(id);
}

function createRows(store, onSelect, onDelete) {
  const rows = [];
  const data = store.data;
  const selected = store.selected;

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const id = d.id;

    rows.push(
      <Row
        key={id}
        data={d}
        id={id}
        selected={selected}
        onDelete={onDelete}
        onSelect={onSelect}
        onShouldComponentUpdate={shouldRowUpdate}
      />
    );
  }
  return <tbody>{rows}</tbody>;
}
const span = <span className="glyphicon glyphicon-remove" aria-hidden="true" />;
const td = <td className="col-md-6" />;

function Row({ data, id, onSelect, onDelete, selected }) {
  return (
    <tr className={id === selected ? "danger" : ""}>
      <td className="col-md-1">{id + ""}</td>
      <td className="col-md-4">
        <a onClick={selectOnClick(onSelect, id)}>{data.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={deleteOnClick(onDelete, id)}>{span}</a>
      </td>
      {td}
    </tr>
  );
}

function Jumbotron(run, runLots, add, update, clear, swapRows) {
  return (
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6">
          <h1>nerv v1.2.4</h1>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-sm-6 smallpad">
              <button
                type="button"
                className="btn btn-primary btn-block"
                id="run"
                onClick={run}
              >
                Create 1,000 rows
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button
                type="button"
                className="btn btn-primary btn-block"
                id="runlots"
                onClick={runLots}
              >
                Create 10,000 rows
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button
                type="button"
                className="btn btn-primary btn-block"
                id="add"
                onClick={add}
              >
                Append 1,000 rows
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button
                type="button"
                className="btn btn-primary btn-block"
                id="update"
                onClick={update}
              >
                Update every 10th row
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button
                type="button"
                className="btn btn-primary btn-block"
                id="clear"
                onClick={clear}
              >
                Clear
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button
                type="button"
                className="btn btn-primary btn-block"
                id="swaprows"
                onClick={swapRows}
              >
                Swap Rows
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

let header;

export class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { store: new Store() };
    this.select = this.select.bind(this);
    this.delete = this.delete.bind(this);
    this.add = this.add.bind(this);
    this.run = this.run.bind(this);
    this.update = this.update.bind(this);
    this.runLots = this.runLots.bind(this);
    this.clear = this.clear.bind(this);
    this.swapRows = this.swapRows.bind(this);
    header = Jumbotron(
      this.run,
      this.runLots,
      this.add,
      this.update,
      this.clear,
      this.swapRows
    );
    this.start = 0;
    this.length = 0;

    window.app = this;
  }
  printDuration() {
    stopMeasure();
  }
  componentDidUpdate() {
    this.printDuration();
  }
  componentDidMount() {
    this.printDuration();
  }
  run() {
    startMeasure("run");
    this.state.store.run();
    this.setState({ store: this.state.store });
  }
  add() {
    startMeasure("add");
    this.state.store.add();
    this.setState({ store: this.state.store });
  }
  update() {
    startMeasure("update");
    this.state.store.update();
    this.setState({ store: this.state.store });
  }
  select(id) {
    startMeasure("select");
    this.state.store.select(id);
    this.setState({ store: this.state.store });
  }
  delete(id) {
    startMeasure("delete");
    this.state.store.delete(id);
    this.setState({ store: this.state.store });
  }
  runLots() {
    startMeasure("runLots");
    this.state.store.runLots();
    this.setState({ store: this.state.store });
  }
  clear() {
    startMeasure("clear");
    this.state.store.clear();
    this.setState({ store: this.state.store });
  }
  swapRows() {
    startMeasure("swapRows");
    this.state.store.swapRows();
    this.setState({ store: this.state.store });
  }
  render() {
    return (
      <div className="container">
        {header}
        <table className="table table-hover table-striped test-data">
          {createRows(this.state.store, this.select, this.delete)}
        </table>
        <span
          className="preloadicon glyphicon glyphicon-remove"
          aria-hidden="true"
        />
      </div>
    );
  }
}

render(<Main />, document.getElementById("main"));
