import app from '../node_modules/apprun/index'
import Store from './store';

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    window.setTimeout(function() {
        var stop = performance.now();
        console.log(lastMeasure+" took "+(stop-startTime));
    }, 0);
}

const store = new Store();

const update = {

    run(store) {
        store.run();
        return store;
    },

    add() {
        store.add();
        return store;
    },

    remove(store, id) {
        console.log(id);
        store.delete(id);
        return store;
    },

    select(store, id) {
        store.select(id);
        return store;
    },

    update() {
        store.update();
        return store;
    },

    runlots() {
        store.runLots();
        return store;
    },

    clear() {
        store.clear();
        return store;
    },

    swaprows() {
        store.swapRows();
        return store;
    }
}

const view = (model) => {

  return '<table class="table table-hover table-striped test-data"><tbody>' +

    model.data.reduce((prev, curr) => {
      const selected = curr.id === model.selected ? "class='danger'" : "";

      return prev + `
      <tr ${selected}>
      <td class="col-md-1">${curr.id}</td>
      <td class="col-md-4">
          <a class="lbl" onclick="app.run('select', ${curr.id})">${curr.label}</a>
      </td>
      <td class="col-md-1">
        <a class="remove" onclick="app.run('remove', ${curr.id})">
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td class="col-md-6"></td>
    </tr>`;
    }, '')

    + '</tbody></table>';
}

document.getElementById("main").addEventListener('click', e => {
  const t = e.target as HTMLElement;
  e.preventDefault();
  if (t && t.tagName === 'BUTTON') {
    startMeasure(t.id);
    app.run(t.id);
    stopMeasure();
  }
});

app.start(document.getElementById('app'), store, view, update);