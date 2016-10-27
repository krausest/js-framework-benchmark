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
        console.log(lastMeasure+" took "+(stop - startTime));
    }, 0);
}

const store = new Store();

const update = {

    run(store) {
        store.run();
        return store;
    },

    add(store) {
        store.add();
        return store;
    },

    remove(store, id) {
        store.delete(id);
        return store;
    },

    select(store, id) {
        this.unselect(store);
        store.select(id);
        store.view = store => {
            const selected = document.getElementById(id);
            if (selected) selected.className = 'danger';
        };
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
        store.view = store => {
            document.getElementById('app').innerHTML = '';
        }
        return store;
    },

    swaprows(store) {
        this.unselect(store);
        store.swapRows();
        return store;
    },

    unselect(store) {
        if (store.selected) {
            let sel = document.getElementById(store.selected);
            if (sel) sel.className = '';
        }
    }
}

const view = (model) => {
    const rows = model.data.map((curr) => {
        const selected = curr.id == model.selected ? 'danger' : '';
        const id = curr.id;
        return <tr className={selected} id={id}>
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

    return <table className="table table-hover table-striped test-data" id="main-table">
        <tbody>{rows}</tbody>
    </table>;
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

document.getElementById("main").addEventListener('click', e => {
    const t = e.target as HTMLElement;
    if (!t) return;
    if (t.tagName === 'BUTTON') {
        e.preventDefault();
        startMeasure(t.id);
        app.run(t.id);
        stopMeasure();
    } else if (t.matches('.remove')) {
        e.preventDefault();
        startMeasure('remove');
        app.run('remove', getId(t));
        stopMeasure();
    } else if (t.matches('.lbl')) {
        e.preventDefault();
        startMeasure('select');
        app.run('select', getId(t));
        stopMeasure();
    }
});

app.start(document.getElementById('app'), store, view, update);