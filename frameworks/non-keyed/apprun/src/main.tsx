import { app, Component } from 'apprun';
import Store from './store';

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
        document.getElementById(id).remove();
    },

    select(store, id) {
        if (store.selected) {
            document.getElementById(store.selected).className = '';
        }
        store.select(id);
        document.getElementById(id).className = 'danger';
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
        document.getElementById("main-table").innerHTML = "";
    },

    swaprows(store) {
        store.swapRows();
        return store;
    }
}

const view = (model) => {
    const rows = model.data.map((curr) => {
        const selected = curr.id == model.selected ? 'danger' : undefined;
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

    return (<div className="container" onclick={click}>
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
        <table className="table table-hover table-striped test-data" id="main-table">
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

const click = (e) => {
    const t = e.target as HTMLElement;
    if (!t) return;
    if (t.tagName === 'BUTTON' && t.id) {
        e.preventDefault();
        component.run(t.id);
    } else if (t.matches('.remove')) {
        e.preventDefault();
        component.run('remove', getId(t));
    } else if (t.matches('.lbl')) {
        e.preventDefault();
        component.run('select', getId(t));
    }
};

const component = new Component(store, view, update);
component['-patch-vdom-on'] = true;
component.rendered = () => {
    store.selected && (document.getElementById(store.selected).className = 'danger');
}
component.start(document.getElementById('main'));
