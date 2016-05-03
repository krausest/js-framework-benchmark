/** @jsx plastiq.jsx */
var plastiq = require('plastiq');
const {Store} = require('./store');

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

var c = {};

function cache(key, render) {
  var value = c[key];

  if (!c[key]) {
    c[key] = value = render();
  }

  return value;
}

class App {
  constructor() {
    this.store = new Store();
  }

  delete(id) {
    this.store.delete(id);
  }

  select(id) {
    this.store.select(id);
  }

  render() {
    return <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-8">
            <h1>plastiq v1.30.0</h1>
          </div>
          <div class="col-md-4">
            <button class="btn btn-primary btn-block" id="add" onclick={() => this.store.add()}>Add 1000 rows</button>
            <button class="btn btn-primary btn-block" id="run" onclick={() => this.store.run()}>Create 1000 rows</button>
            <button class="btn btn-primary btn-block" id="update" onclick={() => this.store.update()}>Update every 10th row</button>
            <button class="btn btn-primary btn-block" id="hideall" onclick={() => this.store.hideAll()}>HideAll</button>
            <button class="btn btn-primary btn-block" id="showall" onclick={() => this.store.showAll()}>ShowAll</button>
            <button class="btn btn-primary btn-block" id="runlots" onclick={() => this.store.runLots()}>Create lots of rows</button>
            <button class="btn btn-primary btn-block" id="clear" onclick={() => this.store.clear()}>Clear</button>
            <button class="btn btn-primary btn-block" id="swaprows" onclick={() => this.store.swapRows()}>Swap Rows</button>
            <h3><span class="glyphicon glyphicon-remove"></span></h3>
          </div>
          <table class="table table-hover table-striped test-data">
            <tbody>
              { this.store.data.map(item => this.renderItem(item)) }
            </tbody>
          </table>
        </div>
      </div>
    </div>;
  }

  renderItem(item) {
    return cache(item.id + ':' + item.label + ':' + (item.id === this.store.selected? 'selected': ''), () => {
      return <tr key={item.id} class={{danger: item.id === this.store.selected}}>
        <td class="col-md-1">{item.id}</td>
        <td class="col-md-4">
          <a data={item.id} onclick={() => this.select(item.id)}>{item.id + ' + ' + item.label}</a>
        </td>
        <td class="col-md-1">
          <a data={item.id} onclick={() => this.delete(item.id)}><span class="glyphicon glyphicon-remove"></span></a>
        </td>
        <td class="col-md-6"/>
      </tr>;
    });
  }
}

plastiq.append(document.body, new App());
