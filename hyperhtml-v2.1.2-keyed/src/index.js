import { bind } from "hyperhtml/esm";

import { startMeasure, stopMeasure } from "./utils";
import { Store } from "./store";
import Row from "./Row.js";

const store = new Store();

Row.app = {
  store,
  render: bind(document.querySelector("#main")),
  update() {
    this.render`
      <div class="container">
        <div class="jumbotron">
          <div class="row">
            <div class="col-md-6">
              <h1>hyper(HTML) v2.1.2</h1>
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
          ${store.data.map(Row.for)}
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>`;
    stopMeasure();
  }
};

Row.app.update();

function run() {
  startMeasure("run");
  store.run();
  Row.app.update();
}

function runLots() {
  startMeasure("runLots");
  store.runLots();
  Row.app.update();
}

function add() {
  startMeasure("add");
  store.add();
  Row.app.update();
}

function update() {
  startMeasure("update");
  store.update();
  Row.app.update();
}

function clear() {
  startMeasure("clear");
  store.clear();
  Row.app.update();
}

function swapRows() {
  startMeasure("swapRows");
  store.swapRows();
  Row.app.update();
}
