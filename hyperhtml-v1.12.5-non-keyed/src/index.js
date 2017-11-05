import hyper from "hyperhtml";

import { startMeasure, stopMeasure } from "./utils";
import { Store } from "./store";

const store = new Store();
const renderOnMain = hyper(document.querySelector("#main"));
app(renderOnMain, store);

//

function app(render) {
  render`
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>HyperHTML v1.12.5</h1>
          </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="run" onclick=${run}>Create 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="runlots" onclick=${runLots}>Create 10,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="add" onclick=${add}>Append 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="update" onclick=${update}>Update every 10th row</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="clear" onclick=${clear}>Clear</button>
            </div>
            <div class="col-sm-6 smallpad">
               <button type="button" class="btn btn-primary btn-block" id="swaprows" onclick=${swapRows}>Swap Rows</button>
            </div>
          </div>
        </div>
      </div>
     </div>
     <table class="table table-hover table-striped test-data">
       <tbody>
         ${store.data.map(row)}
       </tbody>
     </table>
     <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  `;

  stopMeasure();
}

function run() {
  startMeasure("run");
  store.run();
  app(renderOnMain, store);
}

function runLots() {
  startMeasure("runLots");
  store.runLots();
  app(renderOnMain, store);
}

function add() {
  startMeasure("add");
  store.add();
  app(renderOnMain, store);
}

function update() {
  startMeasure("update");
  store.update();
  app(renderOnMain, store);
}

function clear() {
  startMeasure("clear");
  store.clear();
  app(renderOnMain, store);
}

function swapRows() {
  startMeasure("swapRows");
  store.swapRows();
  app(renderOnMain, store);
}

function remove(id) {
  startMeasure("delete");
  store.delete(id);
  app(renderOnMain, store);
}

function select(id) {
  startMeasure("select");
  store.select(id);
  app(renderOnMain, store);
}

function row(state) {
  const { id, label } = state;
  const className = classNameSelected(store.selected);
  return hyper(state, ":row")`
  <tr class=${className(id)}>
    <td class="col-md-1">${id}</td>
    <td class="col-md-4">
      <a onclick=${() => select(id)}>${label}</a>
    </td>
    <td class="col-md-1">
      <a onclick=${() => remove(id)}>
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
  `;
}

function classNameSelected(selected) {
  return id => (id === selected ? "danger" : "");
}
