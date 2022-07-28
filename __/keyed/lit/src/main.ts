import { LitElement, html } from "lit";
import { property, customElement } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { Store } from './store';

const store = new Store();

@customElement('main-element')
export class MainElement extends LitElement {
    @property()
    _rows = store.data;

    @property()
    _selected = store.selected;

    render() {
        return html`
        <link href="/css/currentStyle.css" rel="stylesheet"/>
        <div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>Lit keyed</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="run" @click=${this._run}>Create 1,000 rows</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="runlots" @click=${this._runLots}>Create 10,000 rows</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="add" @click=${this._add}>Append 1,000 rows</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="update" @click=${this._update}>Update every 10th row</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="clear" @click=${this._clear}>Clear</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="swaprows" @click=${this._swapRows}>Swap Rows</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data" @click=${this._handleClick}>
                <tbody>${repeat(this._rows, item => item.id, item => html`
                <tr id=${item.id} class=${item.id == this._selected ? 'danger' : ''}>
                    <td class="col-md-1">${item.id}</td>
                    <td class="col-md-4">
                    <a data-action="select" data-id=${item.id}>${item.label}</a>
                    </td>
                    <td class="col-md-1">
                    <a>
                        <span class="glyphicon glyphicon-remove" aria-hidden="true"
                            data-action="remove" data-id=${item.id}></span>
                    </a>
                    </td>
                    <td class="col-md-6"></td>
                </tr>`)}
                </tbody>
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>
        `;
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
    _sync() {
        this._rows = store.data;
        this._selected = store.selected;
    }
}
