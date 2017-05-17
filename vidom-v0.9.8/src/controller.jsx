/**
 * Created by stef on 17.11.15.
 */
'use strict';
var { node, Component, mount }  = require('vidom');

const {Store} = require('./store');

window.rowsUpdated = 0;
window.rowsMounted = 0;


export class Row extends Component {
    onInit() {
        this._onClick = this._onClick.bind(this);
        this._onDelete = this._onDelete.bind(this);
    }

    onRender(props) {
        let {styleClass, data} = this.attrs;
        return (<tr key={data.id} className={styleClass}>
            <td className="col-md-1">{data.id}</td>
            <td className="col-md-4">
                <a onClick={this._onClick}>{data.label}</a>
            </td>
            <td className="col-md-1"><a onClick={this._onDelete}><span className="glyphicon glyphicon-remove"></span></a></td>
            <td className="col-md-6"></td>
        </tr>);
    }

    _onClick() {
        const {onClick, data} = this.attrs;
        onClick(data.id);
    }

    _onDelete() {
        const {onDelete, data} = this.attrs;
        onDelete(data.id);
    }
}

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
export class Controller extends Component{
    onInit() {
        this.state = {store: new Store()};
        this.select = this.select.bind(this);
        this.delete = this.delete.bind(this);
        this.add = this.add.bind(this);
        this.run = this.run.bind(this);
        this.update10 = this.update10.bind(this);
        this.runLots = this.runLots.bind(this);
        this.clear = this.clear.bind(this);
        this.swapRows = this.swapRows.bind(this);

        var target = document.querySelector('#main');
    }
    run() {
        startMeasure("run");
        this.state.store.run();
        this.state = {store: this.state.store};
        this.update();
    }
    add() {
        startMeasure("add");
        this.start = performance.now();
        this.state.store.add();
        this.state = {store: this.state.store};
        this.update();
    }
    update10() {
        startMeasure("update");
        this.start = performance.now();
        this.state.store.update();
        this.state = {store: this.state.store};
        this.update();
    }
    select(id) {
        startMeasure("select");
        this.start = performance.now();
        this.state.store.select(id);
        this.state = {store: this.state.store};
        this.update();
    }
    delete(id) {
        startMeasure("delete");
        this.start = performance.now();
        this.state.store.delete(id);
        this.state = {store: this.state.store};
        this.update();
    }
    runLots() {
        startMeasure("runLots");
        this.state.store.runLots();
        this.state = {store: this.state.store};
        this.update();
    }
    clear() {
        startMeasure("clear");
        this.state.store.clear();
        this.state = {store: this.state.store};
        this.update();
    }
    swapRows() {
        startMeasure("swapRows");
        this.state.store.swapRows();
        this.state = {store: this.state.store};
        this.update();
    }
    onUpdate() {
        stopMeasure();
    }
    onRender () {
        var rows = this.state.store.data.map((d,i) => {
            return <Row key={d.id} data={d} onClick={this.select} onDelete={this.delete} styleClass={d.id === this.state.store.selected ? 'danger':''}></Row>
        });
        return (<div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                        <h1>Vidom v0.9.8</h1>
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
                                <button type="button" className="btn btn-primary btn-block" id="update" onClick={this.update10}>Update every 10th row</button>
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
                <tbody>{rows}</tbody>
            </table>
            <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>);
 }
}

mount(document.getElementById('main'), node(Controller));
