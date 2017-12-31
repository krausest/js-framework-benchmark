import app, { Component } from 'apprun'
import Store from './store';

var startTime;
var lastMeasure;
var startMeasure = function (name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function () {
    window.setTimeout(function () {
        var stop = performance.now();
        console.log(lastMeasure + " took " + (stop - startTime));
    }, 0);
}

const store = new Store();

const update = {
    '#benchmark': (store) => store,

    run(store) {
        store.run();
        return store;
    },

    add(store) {
        store.add();
        return store;
    },

    remove(store, id) {
        document.getElementById(id).remove();
        store.delete(id);
        store.no_render = true;
        return store;
    },

    select(store, id) {
        if (store.selected) {
            document.getElementById(store.selected).className = '';
        }
        document.getElementById(id).className = 'danger';
        store.select(id);
        store.no_render = true;
        return store;
    },

    update(store) {
        store.update();
        return store;
    },

    runlots(store) {
        store.runLots();
        return store;
    },

    clear(store) {
        store.clear();
        return store;
    },

    swaprows(store) {
        store.swapRows();
        return store;
    }
}

const view = (model) => {
    if (model.no_render) {
        delete model.no_render;
        return;
    }
    const rows = model.data.map((curr) => {
        const selected = curr.id == model.selected ? 'danger' : '';
        const id = curr.id;
        return <tr className={selected} id={id} key={id}>
            <td className="col-md-1">{id}</td>
            <td className="col-md-4">
                <a className="lbl">{curr.label}</a>
            </td>
            <td className="col-md-1">
                <a className="remove">
                    <span className="glyphicon glyphicon-remove remove" aria-hidden="true"></span>
                </a>
            </td>
            <td className="col-md-6"></td>
        </tr>;
    });

    return (<div className="container">
        <div className="jumbotron">
            <div className="row">
                <div className="col-md-6">
                    <h1>AppRun</h1>
                </div>
                <div className="col-md-6">
                    <div className="row">
                        <div className="col-sm-6 smallpad">
                            <button type="button" className="btn btn-primary btn-block" id="run">Create 1,000 rows</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type="button" className="btn btn-primary btn-block" id="runlots">Create 10,000 rows</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type="button" className="btn btn-primary btn-block" id="add">Append 1,000 rows</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type="button" className="btn btn-primary btn-block" id="update">Update every 10th row</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type="button" className="btn btn-primary btn-block" id="clear">Clear</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type="button" className="btn btn-primary btn-block" id="swaprows">Swap Rows</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <table className="table table-hover table-striped test-data">
            <tbody>
                {rows}
            </tbody>
        </table>
        <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>);
}

const getId = (elem) => {
    while (elem) {
        if (elem.tagName === "TR") {
            return elem.id;
        }
        elem = elem.parentNode;
    }
    return undefined;
}

document.body.addEventListener('click', e => {
    const t = e.target as HTMLElement;
    if (!t) return;
    if (t.tagName === 'BUTTON' && t.id) {
        e.preventDefault();
        startMeasure(t.id);
        component.run(t.id);
        stopMeasure();
    } else if (t.matches('.remove')) {
        e.preventDefault();
        startMeasure('remove');
        component.run('remove', getId(t));
        stopMeasure();
    } else if (t.matches('.lbl')) {
        e.preventDefault();
        startMeasure('select');
        component.run('select', getId(t));
        stopMeasure();
    }
});

app.on('//', _ => { })
app.on('#', _ => { })

let component = new Component(store, view, update);
component.start(document.getElementById('main'));
