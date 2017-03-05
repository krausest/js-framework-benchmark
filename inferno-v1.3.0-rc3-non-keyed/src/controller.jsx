'use strict';

import {Store} from './store'
import Inferno, {linkEvent} from 'inferno'
import Component from 'inferno-component'

Inferno.options.recyclingEnabled=false;

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    performance.mark('mark_start_'+name);
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            performance.mark('mark_end_' + last);
            window.performance.measure('measure_' + last, 'mark_start_' + last, 'mark_end_' + last);
            var items = performance.getEntriesByType('measure');
            for (var i = 0; i < items.length; ++i) {
                var req = items[i];
                duration = req.duration;
                console.log(req.name + ' took ' + req.duration + 'ms');
            }
            performance.clearMeasures();
        }, 0);
    }
}

function handleClick(e) {
    let func;
    let id;
    let val = e.target.defaultValue;

    if (val) {
        func = val.func;
        id = val.id;
    } else {
        val = e.target.parentNode.defaultValue;
        if (val) {
            func = val.func;
            id = val.id;
        }
    }
    func && func(id);
}

const span = <span className="glyphicon glyphicon-remove" aria-hidden="true" noNormalize></span>;
const td = <td className="col-md-6" noNormalize></td>;

function Row({ d, id, selected, deleteFunc, selectFunc }) {
    return (
        <tr className={id === selected ? 'danger' : ''} hasNonKeyedChildren noNormalize>
            <td className="col-md-1" noNormalize>{id + ''}</td>
            <td className="col-md-4" noNormalize>
                <a onClick={linkEvent(id, selectFunc)} noNormalize>{d.label}</a>
            </td>
            <td className="col-md-1"><a onClick={linkEvent(id, deleteFunc)} noNormalize>{ span }</a></td>
            { td }
        </tr>
    )
}

const onComponentShouldUpdate = {
    onComponentShouldUpdate(lastProps, nextProps) {
        return nextProps.d !== lastProps.d || nextProps.selected !== lastProps.selected;
    }
};

function createRows(store, deleteFunc, selectFunc) {
    const rows = [];
    const data = store.data;
    const selected = store.selected;

    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const id = d.id;

        rows.push(
            <Row d={d} id={id} selected={selected} deleteFunc={deleteFunc} selectFunc={selectFunc} ref={onComponentShouldUpdate}  />
        );
    }
    return <tbody hasNonKeyedChildren noNormalize>{rows}</tbody>;
}

const title = (
    <div className="col-md-6" noNormalize>
        <h1 noNormalize>Inferno v1.3.0-rc3 - non-keyed</h1>
    </div>
);
const span2 = <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true" noNormalize></span>;

export class Controller extends Component{
    constructor(props) {
        super(props);
        this.state = {store: new Store()};
        this.select = this.select.bind(this);
        this.delete = this.delete.bind(this);
        this.add = this.add.bind(this);
        this.run = this.run.bind(this);
        this.update = this.update.bind(this);
        this.runLots = this.runLots.bind(this);
        this.clear = this.clear.bind(this);
        this.swapRows = this.swapRows.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.start = 0;
    }
    printDuration() {
        stopMeasure();
    }
    componentDidUpdate() {
        this.printDuration();
    }
    componentDidMount() {
        this.printDuration();
    }
    run() {
        startMeasure("run");
        this.state.store.run();
        this.setState({store: this.state.store});
    }
    add() {
        startMeasure("add");
        this.state.store.add();
        this.setState({store: this.state.store});
    }
    update() {
        startMeasure("updater");
        this.state.store.update();
        this.setState({store: this.state.store});
    }
    select(id) {
        console.log("select");
        startMeasure("select");
        this.state.store.select(id);
        this.setState({store: this.state.store});
    }
    delete(id) {
        startMeasure("delete");
        this.state.store.delete(id);
        this.setState({store: this.state.store});
    }
    runLots() {
        startMeasure("runLots");
        this.state.store.runLots();
        this.setState({store: this.state.store});
    }
    clear() {
        startMeasure("clear");
        this.state.store.clear();
        this.setState({store: this.state.store});
    }
    swapRows() {
        startMeasure("swapRows");
        this.state.store.swapRows();
        this.setState({store: this.state.store});
    }
    render () {
        return (<div className="container" hasNonKeyedChildren noNormalize>
            <div className="jumbotron" noNormalize>
                <div className="row" hasNonKeyedChildren noNormalize>
                    { title }
                    <div className="col-md-6" noNormalize>
                        <div className="row" hasNonKeyedChildren noNormalize>
                            <div className="col-sm-6 smallpad" noNormalize>
                                <button type="button" className="btn btn-primary btn-block" id="run" onClick={this.run} noNormalize>Create 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad" noNormalize>
                                <button type="button" className="btn btn-primary btn-block" id="runlots" onClick={this.runLots} noNormalize>Create 10,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad" noNormalize>
                                <button type="button" className="btn btn-primary btn-block" id="add" onClick={this.add} noNormalize>Append 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad" noNormalize>
                                <button type="button" className="btn btn-primary btn-block" id="update" onClick={this.update} noNormalize>Update every 10th row</button>
                            </div>
                            <div className="col-sm-6 smallpad" noNormalize>
                                <button type="button" className="btn btn-primary btn-block" id="clear" onClick={this.clear} noNormalize>Clear</button>
                            </div>
                            <div className="col-sm-6 smallpad" noNormalize>
                                <button type="button" className="btn btn-primary btn-block" id="swaprows" onClick={this.swapRows} noNormalize>Swap Rows</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table table-hover table-striped test-data" noNormalize>
                {createRows(this.state.store, this.delete, this.select)}
            </table>
            { span2 }
        </div>);
 }
}

var str = Inferno.render(<Controller/>,  document.getElementById("main"));