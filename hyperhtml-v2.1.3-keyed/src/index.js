import { bind, wire } from "hyperhtml/esm";

import { startMeasure, stopMeasure } from "./utils";
import { Store } from "./store";

const rows = new WeakMap;
const store = new Store();
const render = bind(document.querySelector("#main"));
app(render);

//

function app(render) {
  render`
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>hyper(HTML) v2.1.3</h1>
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
    </div>`;

  stopMeasure();
}

function run() {
  startMeasure("run");
  store.run();
  app(render);
}

function runLots() {
  startMeasure("runLots");
  store.runLots();
  app(render);
}

function add() {
  startMeasure("add");
  store.add();
  app(render);
}

function update() {
  startMeasure("update");
  store.update();
  app(render);
}

function clear() {
  startMeasure("clear");
  store.clear();
  app(render);
}

function swapRows() {
  startMeasure("swapRows");
  store.swapRows();
  app(render);
}

function remove(id) {
  startMeasure("delete");
  store.delete(id);
  app(render);
}

function select(id) {
  startMeasure("select");
  store.select(id);
  app(render);
}

function row(state) {
  const view = rows.get(state) || createRow(state);
  return view.render`
  <tr class=${view.class(store.selected)}>
    <td class="col-md-1">${state.id}</td>
    <td class="col-md-4">
      <a onclick=${view.onselect}>${state.label}</a>
    </td>
    <td class="col-md-1">
      <a onclick=${view.onremove}>
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
  `;
}

function createRow(state) {
  const row = {
    render: wire(),
    class(selected) {
      return state.id === selected ? 'danger' : '';
    },
    onremove() {
      remove(state.id);
    },
    onselect() {
      select(state.id);
    }
  };
  rows.set(state, row);
  return row;
}
