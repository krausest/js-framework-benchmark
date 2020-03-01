'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
const {Row} = require('./Row');
var {observer} = require("mobx-react");
var {observable, computed} = require ("mobx");
const {Store} = require('./Store');

@observer
export class Main extends React.Component{
    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
        this.delete = this.delete.bind(this);
        this.add = this.add.bind(this);
        this.run = this.run.bind(this);
        this.update = this.update.bind(this);
        this.runLots = this.runLots.bind(this);
        this.clear = this.clear.bind(this);
        this.swapRows = this.swapRows.bind(this);
        this.start = 0;
    }
    run() {
        this.props.store.run();
    }
    add() {
        this.props.store.add();
    }
    update() {
        this.props.store.update();
    }
    select(row) {
        this.props.store.select(row);
    }
    delete(row) {
        this.props.store.delete(row);
    }
    runLots() {
        this.props.store.runLots();
    }
    clear() {
        this.props.store.clear();
    }
    swapRows() {
        this.props.store.swapRows();
    }
    render () {
        let rows = this.props.store.data.map((d,i) => {
            return <Row key={d.id} data={d} onClick={this.select} onDelete={this.delete}></Row>
        });
        return (<div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                        <h1>React + Mobx</h1>
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

let store = new Store();

ReactDOM.render(<Main store={store}/>, document.getElementById('main'));