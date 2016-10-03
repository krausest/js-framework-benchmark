'use strict';

import React from 'react'
import {connect} from 'react-redux';
import shallowCompare from 'react-addons-shallow-compare';

import {
  buildData,
  remove,
  run,
  add,
  update,
  select,
  runLots,
  clear,
  swapRows
} from './store';


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

export class Row extends React.Component {
    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
        this.del = this.del.bind(this);
    }
    click() {
        this.props.onClick(this.props.data.get('id'));
    }
    del() {
        this.props.onDelete(this.props.data.get('id'));
    }

    shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState);
    }

    render() {
        let {styleClass, onClick, onDelete, data} = this.props;
        return (<tr className={styleClass}>
            <td className="col-md-1">{data.get('id')}</td>
            <td className="col-md-4">
                <a onClick={this.click}>{data.get('label')}</a>
            </td>
            <td className="col-md-1"><a onClick={this.del}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
            <td className="col-md-6"></td>
        </tr>);
    }
}

export class Controller extends React.Component{
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
        this.props.run();
    }
    add() {
        startMeasure("add");
        this.props.add();
    }
    update() {
        startMeasure("updater");
        this.props.update();
    }
    select(id) {
        startMeasure("select");
        this.props.select(id);
    }
    delete(id) {
        startMeasure("delete");
        this.props.remove(id);
    }
    runLots() {
        startMeasure("runLots");
        this.props.runLots();
    }
    clear() {
        startMeasure("clear");
        this.props.clear();
    }
    swapRows() {
        startMeasure("swapRows");
        this.props.swapRows();
    }
    render () {
        var rows = this.props.data.map((d,i) => {
            const id = d.get('id');
            var className = id === this.props.selected ? 'danger':'';
            return <Row key={id} data={d} onClick={this.select} onDelete={this.delete} styleClass={className}></Row>
        }).toArray();
        return (<div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                        <h1>React v15.3.2 Redux v3.6.0</h1>
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
                <tbody>{rows}</tbody>
            </table>
            <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>);
 }
}

export default connect(
  state => ({
    data: state.store.get('data'),
    selected: state.store.get('selected')
  }),
  {
    buildData: () => buildData(),
    remove: id => remove(id),
    run: () => run(),
    add: () => add(),
    update: () => update(),
    select: id => select(id),
    runLots: () => runLots(),
    clear: () => clear(),
    swapRows: () => swapRows()
  }
)(Controller);
