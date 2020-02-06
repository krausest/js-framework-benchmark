'use strict';
/** @jsx etch.dom */

var etch = require('etch');
const {Row} = require('./Row');
const {Store} = require('./Store');

export class Main {
    constructor(props, children) {
        this.props = props;
        this.children = children;

        this.store = new Store();

        this.select = this.select.bind(this);
        this.delete = this.delete.bind(this);
        this.add = this.add.bind(this);
        this.run = this.run.bind(this);
        this.updateRows = this.updateRows.bind(this);
        this.runLots = this.runLots.bind(this);
        this.clear = this.clear.bind(this);
        this.swapRows = this.swapRows.bind(this);

        etch.initialize(this);
    }

    update (props, children) {
        return etch.update(this);
    }

    run() {
        this.store.run();
        this.update();
    }
    add() {
        this.store.add();
        this.update();
    }
    updateRows() {
        this.store.update();
        this.update();
    }
    select(id) {
        this.store.select(id);
        this.update();
    }
    delete(id) {
        this.store.delete(id);
        this.update();
    }
    runLots() {
        this.store.runLots();
        this.update();
    }
    clear() {
        this.store.clear();
        this.update();
    }
    swapRows() {
        this.store.swapRows();
        this.update();
    }
    render () {
        let rows = this.store.data.map((d,i) => {
            return <Row key={i} data={d} onClick={this.select} onDelete={this.delete} styleClass={d.id === this.store.selected ? 'danger':''}></Row>
        });
        return (<div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                        <h1>etch v0.12.5 (non-keyed)</h1>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="run" onClick={this.run}>Create 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="runlots" onClick={this.runLots}>Create 10,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="add" onClick={this.add}>Append 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="update" onClick={this.updateRows}>Update every 10th row</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="clear" onClick={this.clear}>Clear</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="swaprows" onClick={this.swapRows}>Swap Rows</button>
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
}
