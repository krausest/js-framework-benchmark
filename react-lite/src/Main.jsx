'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
const {Row} = require('./Row');
const {Store} = require('./Store');

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    //console.timeStamp(name);
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
            console.log(last+" took "+(stop-startTime));
            //document.getElementById("duration").innerHTML = Math.round(stop - startTime) + " ms ("  + Math.round(duration) + " ms)" ;
        }, 0);
    }
}

export class Main extends React.Component{
    constructor(props) {
        super(props);
        this.state = {store: new Store()};
        this.select = this.select.bind(this);
        this.delete = this.delete.bind(this);
        this.add = this.add.bind(this);
        this.run = this.run.bind(this);
        this.update = this.update.bind(this);
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
        startMeasure("update");
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
    render () {
        let rows = this.state.store.data.map((d,i) => {
            return <Row key={d.id} data={d} onClick={this.select} onDelete={this.delete} styleClass={d.id === this.state.store.selected ? 'danger':''}></Row>
        });
        return (<div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-8">
                        <h1>react-lite</h1>
                    </div>
                    <div className="col-md-4">
                        <button type="button" className="btn btn-primary btn-block" id="add" onClick={this.add}>Add 10 rows</button>
                        <button type="button" className="btn btn-primary btn-block" id="run" onClick={this.run}>Create 1000 rows</button>
                        <button type="button" className="btn btn-primary btn-block" id="update" onClick={this.update}>Update every 10th row</button>
                        <h3 id="duration"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span>&nbsp;</h3>
                    </div>
                </div>
            </div>
            <table className="table table-hover table-striped test-data">
                <tbody>
                    {rows}
                </tbody>
            </table>
            </div>);
    }
}
