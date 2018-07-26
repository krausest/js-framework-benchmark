'use strict';

var dio = require('dio.js');
const { Row } = require('./Row');
const { run, runLots, add, update, swapRows, deleteRow } = require('./utils')
var startTime;
var lastMeasure;
var startMeasure = function (name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function () {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last + " took " + (stop - startTime));
        }, 0);
    }
}

export class Main extends dio.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selected: undefined,
            id: 1
        };
        this.select = this.select.bind(this);
        this.delete = this.delete.bind(this);
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
        const { id } = this.state;
        const obj = run(id);
        this.setState({ data: obj.data, id: obj.id, selected: undefined });
    }
    add() {
        startMeasure("add");
        const { id } = this.state;
        const obj = add(id, this.state.data);
        this.setState({ data: obj.data, id: obj.id});
    }
    update() {
        startMeasure("update");
        const data = update(this.state.data);
        this.setState({ data: data });
    }
    select(id) {
        startMeasure("select");
        this.setState({ selected: id });
    }
    delete(id) {
        startMeasure("delete");
        const data = deleteRow(this.state.data, id);
        this.setState({ data: data });
    }
    runLots() {
        startMeasure("runLots");
        const { id } = this.state;
        const obj = runLots(id);
        this.setState({ data: obj.data, id: obj.id, selected: undefined });
    }
    clear() {
        startMeasure("clear");
        this.setState({ data: [], selected: undefined });
    }
    swapRows() {
        startMeasure("swapRows");
        const data = swapRows(this.state.data);
        this.setState({ data: data });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, selected } = this.state;
        const nextData = nextState.data;
        const nextSelected = nextState.selected;
        return !(data.length === nextData.length && data.every((v, i) => v === nextData[i])) || selected != nextSelected;
    }
    render() {
        let rows = this.state.data.map((d, i) => {
            return <Row key={d.id} data={d} onClick={this.select} onDelete={this.delete} styleClass={d.id === this.state.selected ? 'danger' : ''}></Row>
        });
        return (<div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                        <h1>DIO keyed</h1>
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
                <tbody>
                    {rows}
                </tbody>
            </table>
            <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>);
    }
}
