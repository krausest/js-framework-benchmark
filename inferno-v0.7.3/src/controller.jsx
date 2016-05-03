'use strict';

import {Store} from './store'

import Inferno from 'inferno'
import InfernoDOM from 'inferno-dom'
import Component from 'inferno-component'
console.log(Store, Inferno, InfernoDOM, Component);


var startTime;
var lastMeasure;
var startMeasure = function(name) {
    //console.timeStamp(name);
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

            //var t = window.performance.timing,
            //    complete = t.domComplete - t.domLoading,
            //    loadEventEnd = t.loadEventEnd - t.domLoading;
            //console.log(complete, loadEventEnd);
            //document.getElementById("duration").innerHTML = Math.round(stop - startTime) + " ms ("  + Math.round(duration) + " ms)" ;
        }, 0);
    }
}

export class Row extends Component {
    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
        this.del = this.del.bind(this);
    }
//	componentDidUpdate() {
//		window.rowsUpdated++;
//	}
//	componentDidMount() {
//		window.rowsMounted++;
//	}
    click() {
        this.props.onClick(this.props.data.id);
    }
    del() {
        this.props.onDelete(this.props.data.id);
    }

    render() {
        let {styleClass, onClick, onDelete, data} = this.props;
        return (<tr className={styleClass}>
            <td className="col-md-1">{data.id}</td>
            <td className="col-md-4">
                <a onClick={this.click}>{data.label}</a>
            </td>
            <td className="col-md-1"><a onClick={this.del}><span className="glyphicon glyphicon-remove"></span></a></td>
            <td className="col-md-6"></td>
        </tr>);
    }
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
        this.hideAll = this.hideAll.bind(this);
        this.showAll = this.showAll.bind(this);
        this.runLots = this.runLots.bind(this);
        this.clear = this.clear.bind(this);
        this.swapRows = this.swapRows.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.start = 0;
    }
    printDuration() {
        stopMeasure();
        //document.getElementById("duration").innerHTML = Math.round(performance.now() - this.start) + " ms";
        //console.log("updated "+window.rowsUpdated+" mounted "+window.rowsMounted)
        //window.rowsUpdated = 0;
        //window.rowsMounted = 0;
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
    hideAll() {
        startMeasure("hideAll");
        this.state.store.hideAll();
        this.setState({store: this.state.store});
    }
    showAll() {
        startMeasure("showAll");
        this.state.store.showAll();
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
        var rows = this.state.store.data.map((d,i) => {
            var className = d.id === this.state.store.selected ? 'danger':'x';
            return <Row key={d.id} data={d} onClick={this.select} onDelete={this.delete} styleClass={className}></Row>
        });
        return (<div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-8">
                        <h1>Inferno v0.7.3</h1>
                    </div>
                    <div className="col-md-4">
                        <button type="button" className="btn btn-primary btn-block" id="add" onClick={this.add}>Add 1000 rows</button>
                        <button type="button" className="btn btn-primary btn-block" id="run" onClick={this.run}>Create 1000 rows</button>
                        <button type="button" className="btn btn-primary btn-block" id="update" onClick={this.update}>Update every 10th row</button>
                        <button type="button" className="btn btn-primary btn-block" id="hideall" onClick={this.hideAll}>HideAll</button>
                        <button type="button" className="btn btn-primary btn-block" id="showall" onClick={this.showAll}>ShowAll</button>
                        <button type="button" className="btn btn-primary btn-block" id="runlots" onClick={this.runLots}>Create lots of rows</button>
                        <button type="button" className="btn btn-primary btn-block" id="clear" onClick={this.clear}>Clear</button>
                        <button type="button" className="btn btn-primary btn-block" id="swaprows" onClick={this.swapRows}>Swap Rows</button>
                        <h3 id="duration"><span className="glyphicon glyphicon-remove"></span>&nbsp;</h3>
                    </div>
                </div>
            </div>
            <table className="table table-hover table-striped test-data">
                <tbody>{rows}</tbody>
            </table>
        </div>);
 }
}

var str = InfernoDOM.render(<Controller/>,  document.getElementById("main"));