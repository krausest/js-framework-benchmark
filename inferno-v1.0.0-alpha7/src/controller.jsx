'use strict';

import {Store} from './store'
import Inferno, { ChildrenTypes } from 'inferno'
import InfernoDOM from 'inferno-dom'
import Component from 'inferno-component'

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

function clickEvent(e) {
    let func;
    let id;
    let val = e.target.value;

    if (val) {
        func = val.func;
        id = val.id;
    } else {
        val = e.target.parentNode.value;
        if (val) {
            func = val.func;
            id = val.id;
        }
    }
    func(id);
}

function Row({ d, id, selected, deleteFunc, selectFunc }) {
    return (
        <tr className={id === selected ? 'danger' : ''} childrenType={ ChildrenTypes.NON_KEYED }>
            <td className="col-md-1" childrenType={ ChildrenTypes.TEXT }>{id}</td>
            <td className="col-md-4" childrenType={ ChildrenTypes.NODE }>
                <a onClick={clickEvent} value={{func: selectFunc, id}} childrenType={ ChildrenTypes.TEXT }>{d.label}</a>
            </td>
            <td className="col-md-1"><a onClick={clickEvent} value={{func: deleteFunc, id}}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
            <td className="col-md-6"></td>
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
            <Row d={d} id={id} selected={selected} deleteFunc={deleteFunc} selectFunc={selectFunc} hooks={onComponentShouldUpdate} />
        );
    }
    return <tbody childrenType={ ChildrenTypes.NON_KEYED }>{rows}</tbody>;
}

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
        return (<div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                        <h1>Inferno v1.0.0-alpha7 - non-keyed</h1>
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
                                <button type="button" className="btn btn-primary btn-block" id="update" onClick={this.update}>Update every 10th row</button>
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
                {createRows(this.state.store, this.delete, this.select)}
            </table>
            <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>);
 }
}

var str = InfernoDOM.render(<Controller/>,  document.getElementById("main"));