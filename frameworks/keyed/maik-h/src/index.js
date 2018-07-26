

import {bind, html, repeat} from 'maik.h/default-maik'
import {Subject} from 'rxjs/_esm2015/Subject'
import 'rxjs/_esm2015/add/operator/map'

const render = bind(document.querySelector("#main"))

var startTime;
var lastMeasure;

var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
};
var stopMeasure = function() {
    window.setTimeout(function() {
        var stop = performance.now();
        console.log(lastMeasure+" took "+(stop-startTime));
    }, 0);
};

function add() {
  startMeasure("add");
  data = data.concat(buildData(1000));
  data$.next(data);
  stopMeasure();
}
function run() {
  startMeasure("run");
  data = buildData(1000)
  data$.next(data);
  stopMeasure();
}
function runLots() {
  startMeasure("runLots");
  data = buildData(10000);
  data$.next(data);
  stopMeasure();
}
function clear() {
  startMeasure("clear")
  requestAnimationFrame(() => {
    data = []
    data$.next(data)
    stopMeasure();
  })
}
function del(idx) {
  startMeasure("delete")
  data.splice(idx, 1)
  data$.next(data)
  stopMeasure();
}
function select(id) {
  startMeasure("select")
  selected = parseInt(id)
  data$.next(data)
  stopMeasure();
}
function swapRows() {
  startMeasure("swapRows");
  if(data.length > 998) {
      var tmp = data[1];
      data[1] = data[998];
      data[998] = tmp;
  }
  data$.next(data)
  stopMeasure();

}
function update() {
  startMeasure("update");
  for (let i=0;i<data.length;i+=10) {
      data[i].label += ' !!!';
  }
  data$.next(data)
  stopMeasure();

}
function rowClass(id, selected) {
  return id === selected ? "danger" : '';
}

let selected = 0
let did = 1
let data = []
let data$ = new Subject()

function buildData(count) {
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    var data = [];
    for (var i = 0; i < count; i++) {
        data.push({ id: did++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
    }
    return data;
}
function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}


render `
<div class="container" >
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>maik-h "keyed"</h1>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="run" on-click=${run}>Create 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="runlots" on-click=${runLots}>Create 10,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary
                        btn-block" id="add" on-click=${add}>Append 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary
                        btn-block" id="update" on-click=${update}>Update every 10th row</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary
                        btn-block" id="clear" on-click=${clear}>Clear</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary
                        btn-block" id="swaprows" on-click=${swapRows}>Swap Rows</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <table class="table table-hover table-striped test-data">
        <tbody>${repeat(data$,((item, idx) => html(item.id)`
            <tr class$="${rowClass(item.id, selected)}">
              <td class="col-md-1">${item.id}</td>
              <td class="col-md-4">
                  <a on-click="${(e) => { select(item.id) }}">${item.label}</a>
              </td>
              <td class="col-md-1"><a on-click="${(e) => { del(idx) }}"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
              <td class="col-md-6"></td>
            </tr>`))}
        </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>`
