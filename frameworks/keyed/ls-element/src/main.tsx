import { Attribute, AutonomousCustomElement, h, LSCustomElement } from '@lsegurado/ls-element/dist/index';
import { Store } from './store';

const store = new Store();

@AutonomousCustomElement({shadow: false})
export class MainElement extends HTMLElement implements LSCustomElement {
    @Attribute() _rows = store.data;
    @Attribute() _selected = store.selected;

    render() {
        return (
            <>
                <div id="container" class="container">
                    <div id="jumbotron" class="jumbotron">
                        <div id="1" class="row">
                            <div id="2" class="col-md-6">
                                <h1 id="3">LS-Element keyed</h1>
                            </div>
                            <div id="4" class="col-md-6">
                                <div id="5" class="row">
                                    <div id="6" class="col-sm-6 smallpad">
                                        <button type="button" class="btn btn-primary btn-block" id="run" onpointerup={() => () => this._run()}>Create 1,000 rows</button>
                                    </div>
                                    <div id="7" class="col-sm-6 smallpad">
                                        <button type="button" class="btn btn-primary btn-block" id="runlots" onpointerup={() => this._runLots()}>Create 10,000 rows</button>
                                    </div>
                                    <div id="8" class="col-sm-6 smallpad">
                                        <button type="button" class="btn btn-primary btn-block" id="add" onpointerup={() => this._add()}>Append 1,000 rows</button>
                                    </div>
                                    <div id="9" class="col-sm-6 smallpad">
                                        <button type="button" class="btn btn-primary btn-block" id="update" onpointerup={() => this._update()}>Update every 10th row</button>
                                    </div>
                                    <div id="10" class="col-sm-6 smallpad">
                                        <button type="button" class="btn btn-primary btn-block" id="clear" onpointerup={() => this._clear()}>Clear</button>
                                    </div>
                                    <div id="11" class="col-sm-6 smallpad">
                                        <button type="button" class="btn btn-primary btn-block" id="swaprows" onpointerup={() => this._swapRows()}>Swap Rows</button>
                                    </div >
                                </div >
                            </div >
                        </div >
                    </div >
                    <table id="table" class="table table-hover table-striped test-data" onpointerup={(ev) => this._handleClick(ev)}>
                        <tbody id="body">{this._rows.map(item => (
                            <tr id={item.id} class={item.id == this._selected ? 'danger' : ''}>
                                <td id={item.id+1} class="col-md-1">{item.id}</td>
                                <td id={item.id+2} class="col-md-4">
                                    <a id={item.id+3} data-action="select" data-id={item.id}>{item.label}</a>
                                </td>
                                <td id={item.id+4} class="col-md-1">
                                    <a id={item.id+5}>
                                        <span id={item.id+6} class="glyphicon glyphicon-remove" aria-hidden="true"
                                            data-action="remove" data-id={item.id}></span>
                                    </a>
                                </td>
                                <td id={item.id+7} class="col-md-6"></td>
                            </tr>))}
                        </tbody>
                    </table >
                    <span id="icon" class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
                </div >
            </>
        )
    }

    _sync() {
        this._rows = store.data;
        this._selected = store.selected;
    }
    _handleClick(e) {
        const { action, id } = e.target.dataset
        if (action && id) {
            this['_' + action](id)
        }
    }
    _add() {
        store.add();
        this._sync();
        console.log(this._rows);
    }
    _remove(id) {
        store.delete(id);
        this._sync();
    }
    _select(id) {
        store.select(id);
        this._sync();
    }
    _run() {
        store.run();
        this._sync();
    }
    _update() {
        store.update();
        this._sync();
    }
    _runLots() {
        store.runLots();
        this._sync();
    }
    _clear() {
        store.clear();
        this._sync();
    }
    _swapRows() {
        store.swapRows();
        this._sync();
    }
}
