"use strict";
import { fidan } from "@fidanjs/runtime";

var startTime;
var lastMeasure;
var startMeasure = function(name) {
  startTime = performance.now();
  lastMeasure = name;
};
var stopMeasure = function() {
  var last = lastMeasure;
  if (lastMeasure) {
    window.setTimeout(function() {
      lastMeasure = null;
      var stop = performance.now();
      console.log(last + " took " + (stop - startTime));
    }, 0);
  }
};

let did = 1;
function buildData(count) {
  var adjectives = [
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
    "fancy"
  ];
  var colours = [
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
    "orange"
  ];
  var nouns = [
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
    "keyboard"
  ];
  var data = [];
  for (var i = 0; i < count; i++) {
    data.push({
      id: fidan.value(did++),
      label: fidan.value(
        adjectives[_random(adjectives.length)] +
          " " +
          colours[_random(colours.length)] +
          " " +
          nouns[_random(nouns.length)]
      )
    });
  }
  return data;
}
function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const dataArray = fidan.array([]);
const selectedTr = fidan.value(null);

fidan.beforeComputeBy(selectedTr, (current, prev) => {
  if (prev) prev.className = "";
  if (current) current.className = "danger";
});

const run = () => {
  startMeasure("run");
  const data = buildData(1000);
  dataArray(data);
  stopMeasure();
};

const runLots = () => {
  startMeasure("runLots");
  selectedTr(null);
  const data = buildData(10000);
  dataArray(data);
  stopMeasure();
};

const add = () => {
  startMeasure("add");
  selectedTr(null);
  const currentData = dataArray();
  const newData = buildData(1000);
  currentData.push.apply(currentData, newData);
  stopMeasure();
};

const cleardata = () => {
  startMeasure("cleardata");
  selectedTr(null);
  dataArray([]);
  stopMeasure();
};

const select = e => {
  startMeasure("select");
  selectedTr(e.target.parentNode.parentNode);
  stopMeasure();
};

const del = e => {
  startMeasure("del");
  const id = parseInt(e.target.getAttribute("data-id"));
  const data = dataArray();
  const idx = data.findIndex(item => item.id() == id);
  data.splice(idx, 1);
  stopMeasure();
};

const update = () => {
  startMeasure("update");
  const data = dataArray();
  for (let i = 0; i < data.length; i += 10) {
    data[i].label(data[i].label() + " !!!");
  }
  stopMeasure();
};

const swaprows = () => {
  startMeasure("swaprows");
  const data = dataArray();
  const x = 1,
    y = 998;
  data.splice(y, 1, data.splice(x, 1, data[y])[0]);
  stopMeasure();
};

const itemView = dataItem => {
  return fidan.html`
  <tr>
      <td class="col-md-1">${dataItem.id}</td>
      <td class="col-md-4">
          <a class="lbl">${dataItem.label}</a>
      </td>
      <td class="col-md-1">
        <a data-id="${dataItem.id}">
          <span data-id="${
            dataItem.id
          }" class="remove glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td class="col-md-6"></td>
  </tr>
`;
};

const mainView = fidan.html`
  <div class="container" id="main">
      <div class="jumbotron">
          <div class="row">
              <div class="col-md-6">
                  <h1>fidan</h1>
              </div>
              <div class="col-md-6">
                  <div class="row">
                      <div class="col-sm-6 smallpad">
                          <button onclick="${run}" type="button" class="btn btn-primary btn-block" id="run">Create 1,000 rows</button>
                      </div>
                      <div class="col-sm-6 smallpad">
                          <button onclick="${runLots}" type="button" class="btn btn-primary btn-block" id="runlots">Create 10,000 rows</button>
                      </div>
                      <div class="col-sm-6 smallpad">
                          <button type="button" class="btn btn-primary
                          btn-block" id="add" onclick="${add}">Append 1,000 rows</button>
                      </div>
                      <div class="col-sm-6 smallpad">
                          <button type="button" class="btn btn-primary
                          btn-block" id="update" onclick="${update}">Update every 10th row</button>
                      </div>
                      <div class="col-sm-6 smallpad">
                          <button type="button" class="btn btn-primary
                          btn-block" id="clear" onclick="${cleardata}">Clear</button>
                      </div>
                      <div class="col-sm-6 smallpad">
                          <button type="button" class="btn btn-primary
                          btn-block" id="swaprows" onclick="${swaprows}">Swap Rows</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <table class="table table-hover table-striped test-data">
          <tbody>
          ${fidan.htmlArrayMap(dataArray, itemView, {
            useCloneNode: true
          })}
          </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>
`;

mainView.firstElementChild.addEventListener("click", e => {
  if (e.target.matches(".lbl")) {
    select(e);
  } else if (e.target.matches(".remove")) {
    del(e);
  }
});

document.getElementById("main").appendChild(mainView);
