/** @jsx h */
var { default: h, hr } = require('rx-domh');
var Rx = require('rxjs');
const { Store } = require('./Store.es6');

var startTime;
var lastMeasure;
var startMeasure = function (name) {
  startTime = performance.now();
  lastMeasure = name;
}
var stopMeasure = function () {
  var last = lastMeasure;
  if (lastMeasure) {
    window.setTimeout(function () {
      lastMeasure = null;
      var stop = performance.now();
      var duration = 0;
      console.log(last + " took " + (stop - startTime));
    }, 0);
  }
}

// var run$ = new Rx.BehaviorSubject(null);
// var runLots$ = new Rx.BehaviorSubject(null);
// var add$ = new Rx.BehaviorSubject(null);
// var update$ = new Rx.BehaviorSubject(null);
// var clear$ = new Rx.BehaviorSubject(null);
// var swapRows$ = new Rx.BehaviorSubject(null);
var command$ = new Rx.BehaviorSubject(null);

var rows$ = new Rx.BehaviorSubject([]);

var selected$ = new Rx.BehaviorSubject(NaN);

const store = new Store();

command$.subscribe(command => {
  // if (text_input.value) {
  //   todos$.next(todos$.value.concat({content: text_input.value, completed: false}));
  //   text_input.value = '';
  // }
  if (!command) {
    return;
  }
  switch (command.command) {
    case 'run':
      startMeasure("run");
      store.run();
      rows$.next(store.data);
      break;
    case 'runlots':
      startMeasure("runlots");
      store.runLots();
      rows$.next(store.data);
      break;
    case 'add':
      startMeasure("add");
      store.add();
      rows$.next(store.data);
      break;
    case 'update':
      startMeasure("update");
      store.update();
      rows$.next(store.data);
      break;
    case 'clear':
      startMeasure("clear");
      store.clear();
      rows$.next(store.data);
      break;
    case 'swaprows':
      startMeasure("swaprows");
      store.swapRows();
      rows$.next(store.data);
      break;
    case 'select':
      startMeasure('select');
      store.select(command.id);
      selected$.next(store.selected);
      break;
    case 'delete':
      startMeasure('delete');
      store.delete(command.id);
      rows$.next(store.data);
      break;
    default:
      // throw new Error('Unknown command!');
      break;
  }
  stopMeasure();
});

var root = (
  <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>rx-domh v0.0.2 and rxjs v5.3.0</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="run" onClick={command$.next.bind(command$, {command: 'run'})}>Create 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="runlots" onClick={command$.next.bind(command$, {command:'runlots'})}>Create 10,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="add" onClick={command$.next.bind(command$, {command:'add'})}>Append 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="update" onClick={command$.next.bind(command$, {command:'update'})}>Update every 10th row</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="clear" onClick={command$.next.bind(command$, {command:'clear'})}>Clear</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="swaprows" onClick={command$.next.bind(command$, {command:'swaprows'})}>Swap Rows</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped test-data">
      <tbody>
        {hr(rows$, row_data => (
          <tr class={selected$.map(selected => row_data.id === selected ? 'danger':'')}>
            <td class="col-md-1">{row_data.id}</td>
            <td class="col-md-4">
              <a onClick={command$.next.bind(command$, {command:'select', id:row_data.id})}>{row_data.label}</a>
            </td>
            <td class="col-md-1"><a onClick={command$.next.bind(command$, {command:'delete', id:row_data.id})}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
            <td class="col-md-6"></td>
          </tr>
        ))}
      </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>
);

document.getElementById('main').appendChild(root);