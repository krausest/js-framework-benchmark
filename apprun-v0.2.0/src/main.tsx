import app from '../node_modules/apprun/apprun-jsx/index'
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
  const rows = model.data.map((curr) => {
    const selected = curr.id == model.selected ? 'danger' : '';
    const id = curr.id;
    return <tr className={selected} id={id}>
      <td className="col-md-1">{id}</td>
      <td className="col-md-4">
          <a className="lbl" onclick={ ()=>app.run('select', id) }>{curr.label}</a>
      </td>
      <td className="col-md-1">
        <a className="remove" onclick={ ()=>app.run('remove', id) }>
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td className="col-md-6"></td>
    </tr>;
  });

  return <table className="table table-hover table-striped test-data">
    <tbody>{rows}</tbody>
  </table>;
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