'use strict';

import { Store } from './store.es6'
import { linkEvent, Component, render, createTextVNode } from 'inferno'

function Row({ d, id, styleClass, deleteFunc, selectFunc }) {
  /*
   * Only <td className="col-md-1"> and  <a onClick={linkEvent(id, selectFunc)}/>, nodes needs children shape flags
   * Because they have dynamic children. We can pre-define children type by using $HasVNodeChildren
   *
   * other elements don't have children so $NoNormalize is not needed there
   */
  return (
    <tr className={styleClass}>
      <td className="col-md-1" $HasVNodeChildren>{createTextVNode(id + '')}</td>
      <td className="col-md-4">
        <a onClick={linkEvent(id, selectFunc)} $HasVNodeChildren>{createTextVNode(d.label)}</a>
      </td>
      <td className="col-md-1">
        <a onClick={linkEvent(id, deleteFunc)}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true"/>
        </a>
      </td>
      <td className="col-md-6"/>
    </tr>
  )
}

function onComponentShouldUpdate(lastProps, nextProps) {
  return nextProps.d !== lastProps.d || nextProps.styleClass !== lastProps.styleClass;
}

function createRows(store, deleteFunc, selectFunc) {
  const rows = [];
  const data = store.data;
  const selected = store.selected;

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const id = d.id;

    rows.push(
      <Row
        styleClass={id === selected ? 'danger' : null}
        key={id}
        d={d}
        id={id}
        selected={selected}
        deleteFunc={deleteFunc}
        selectFunc={selectFunc}
        onComponentShouldUpdate={onComponentShouldUpdate}
      />
    );
  }

  /*
   * We can optimize rendering rows by pre-defining children types.
   * In this case all children are keyed: so we add flag $HasKeyedChildren and $NoNormalize
   * when specific shape is used we need to make sure there are no holes in the array and are keys are unique
   */
  return <tbody $HasKeyedChildren>{rows}</tbody>;
}

export class Controller extends Component {
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
    this.startTime = null;
    this.lastMeasure = "";
  }

  startMeasure(name) {
    this.startTime = performance.now();
    this.lastMeasure = name;
  };

  stopMeasure() {
    window.setTimeout(() => {
      let stop = performance.now();
      console.log(this.lastMeasure+" took "+(stop-this.startTime));
    }, 0);
  }

  run() {
    this.startMeasure("run");
    event.stopPropagation();
    this.state.store.run();
    this.setState({ store: this.state.store });
    this.stopMeasure();
  }

  add() {
    this.startMeasure("add");
    event.stopPropagation();
    this.state.store.add();
    this.setState({ store: this.state.store });
    this.stopMeasure();
  }

  update() {
    this.startMeasure("update");
    event.stopPropagation();
    this.state.store.update();
    this.setState({ store: this.state.store });
    this.stopMeasure();
  }

  select(id, event) {
    this.startMeasure("select");
    event.stopPropagation();
    this.state.store.select(id);
    this.setState({ store: this.state.store });
    this.stopMeasure();
  }

  delete(id, event) {
    this.startMeasure("delete");
    event.stopPropagation();
    this.state.store.delete(id);
    this.setState({ store: this.state.store });
    this.stopMeasure();
  }

  runLots() {
    this.startMeasure("runLots");
    event.stopPropagation();
    this.state.store.runLots();
    this.setState({ store: this.state.store });
    this.stopMeasure();
  }

  clear(event) {
    this.startMeasure("clear");
    event.stopPropagation();
    this.state.store.clear();
    this.setState({ store: this.state.store });
    this.stopMeasure();
  }

  swapRows() {
    this.startMeasure("swapRows");
    event.stopPropagation();
    this.state.store.swapRows();
    this.setState({ store: this.state.store });
    this.stopMeasure();
  }

  render() {
    /*
     * Only <table> needs $HasVNodeChildren flag everything else is static
     * tables children is tbody so another vNode, no other flags needed
     */
    return (<div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>Inferno - keyed</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-sm-6 smallpad">
                <button type="button" className="btn btn-primary btn-block" id="run" onClick={this.run}>Create 1,000
                  rows
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button type="button" className="btn btn-primary btn-block" id="runlots" onClick={this.runLots}>Create
                  10,000 rows
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button type="button" className="btn btn-primary btn-block" id="add" onClick={this.add}>Append 1,000
                  rows
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button type="button" className="btn btn-primary btn-block" id="update" onClick={this.update}>Update
                  every 10th row
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button type="button" className="btn btn-primary btn-block" id="clear" onClick={this.clear}>Clear
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button type="button" className="btn btn-primary btn-block" id="swaprows" onClick={this.swapRows}>Swap
                  Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data" $HasVNodeChildren>
        {createRows(this.state.store, this.delete, this.select)}
      </table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"/>
    </div>);
  }
}

render(<Controller/>, document.getElementById("main"));
