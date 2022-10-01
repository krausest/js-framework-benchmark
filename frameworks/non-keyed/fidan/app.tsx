"use strict";
import { value, beforeCompute, FidanArray } from "@fidanjs/runtime";

import { buildData, BenchmarkDataRow } from "./data";
import { jsxArrayMap } from "@fidanjs/jsx";

const dataArray = value([]) as FidanArray<BenchmarkDataRow[]>;
const selectedTr = value<HTMLElement>(null);

beforeCompute<HTMLElement>(
  null,
  (current, prev) => {
    if (prev) prev.className = "";
    if (current) current.className = "danger";
  },
  [selectedTr]
);

const run = () => {
  const data = buildData(1000);
  dataArray(data);
};

const runLots = () => {
  selectedTr(null);
  const data = buildData(10000);
  dataArray(data);
};

const add = () => {
  selectedTr(null);
  const currentData = dataArray();
  const newData = buildData(1000);
  currentData.push.apply(currentData, newData);
};

const cleardata = () => {
  selectedTr(null);
  dataArray([]);
};

const select = e => {
  selectedTr(e.target.parentNode.parentNode);
};

const del = e => {
  const id = parseInt(e.target.getAttribute("data-id"));
  const data = dataArray();
  const idx = data.findIndex(item => item.id() == id);
  data.splice(idx, 1);
};

const update = () => {
  const data = dataArray();
  for (let i = 0; i < data.length; i += 10) {
    data[i].label(data[i].label() + " !!!");
  }
};

const swaprows = () => {
  const data = dataArray();
  const x = 1,
    y = 998;
  const sp1 = data.splice(x, 1, data[y])[0];
  data.splice(y, 1, sp1);
  // dataArray().splice(y, 1, dataArray().splice(x, 1, dataArray()[y])[0]);
};

const itemView = (dataItem: BenchmarkDataRow) => {
  return (
    <tr>
      <td className="col-md-1">{dataItem.id}</td>
      <td className="col-md-4">
        <a className="lbl">{dataItem.label}</a>
      </td>
      <td className="col-md-1">
        <a data-id={dataItem.id}>
          <span
            data-id={dataItem.id}
            className="remove glyphicon glyphicon-remove"
            aria-hidden="true"
          />
        </a>
      </td>
      <td className="col-md-6" />
    </tr>
  );
};

const mainView = ((
  <div className="container" id="main">
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6">
          <h1>fidan</h1>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-sm-6 smallpad">
              <button
                onClick={run}
                type="button"
                className="btn btn-primary btn-block"
                id="run"
              >
                Create 1,000 rows
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button
                onClick={runLots}
                type="button"
                className="btn btn-primary btn-block"
                id="runlots"
              >
                Create 10,000 rows
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button
                type="button"
                className="btn btn-primary
                          btn-block"
                id="add"
                onClick={add}
              >
                Append 1,000 rows
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button
                type="button"
                className="btn btn-primary
                          btn-block"
                id="update"
                onClick={update}
              >
                Update every 10th row
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button
                type="button"
                className="btn btn-primary
                          btn-block"
                id="clear"
                onClick={cleardata}
              >
                Clear
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button
                type="button"
                className="btn btn-primary btn-block"
                id="swaprows"
                onClick={swaprows}
              >
                Swap Rows
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table className="table table-hover table-striped test-data">
      <tbody {...jsxArrayMap(dataArray, itemView, "reconcile")} />
    </table>
    <span
      className="preloadicon glyphicon glyphicon-remove"
      aria-hidden="true"
    />
  </div>
) as any) as HTMLElement;

mainView.addEventListener("click", (e: any) => {
  if (e.target.matches(".lbl")) {
    select(e);
  } else if (e.target.matches(".remove")) {
    del(e);
  }
});

document.getElementById("main").appendChild(mainView);
