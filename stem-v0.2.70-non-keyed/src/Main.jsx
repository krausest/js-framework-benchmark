'use strict';

import {State} from "State";

import {UI} from "UI";
import {Row} from  "Row";
import {RowStore} from "RowState";


let rowState = new State();

let rowStore = new RowStore(rowState);

let startTime;
let lastMeasure;
let startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
let stopMeasure = function() {
    let last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            let stop = performance.now();
            let duration = 0;
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

class BenchmarkElement extends UI.Element {

    extraNodeAttributes(attr) {
        attr.addClass("container");
    }

    printDuration() {
        stopMeasure();
    }
    run() {
        startMeasure("run");
        rowStore.run();
        this.printDuration();
    }
    add() {
        startMeasure("add");
        rowStore.add();
        this.printDuration();
    }
    update() {
        startMeasure("update");
        rowStore.update();
        this.printDuration();
    }
    select(id) {
        startMeasure("select");
        rowStore.select(id);
        this.printDuration();
    }
    runLots() {
        startMeasure("runLots");
        rowStore.runLots();
        this.printDuration();
    }
    clear() {
        startMeasure("clear");
        rowStore.clear();
        this.printDuration();
    }
    swapRows() {
        startMeasure("swapRows");

        const i = 1;
        const j = 998;

        let obj_i = this.tbody.getGivenChildren()[i];
        let obj_j = this.tbody.getGivenChildren()[j];

        let obj_i_opts = obj_i.options;
        let obj_j_opts = obj_j.options;

        let aux_obj = obj_i_opts.rowObject;
        obj_i_opts.rowObject = obj_j_opts.rowObject;
        obj_j_opts.rowObject = aux_obj;

        obj_i.refresh();
        obj_j.refresh();

        this.printDuration();
    }

    rowFromStateObject(stateObject) {
        return <Row rowObject={stateObject} ref={this.refLink("row" + stateObject.id)} />;
    }

    render () {
        const rows = rowStore.all().map((rowState) => this.rowFromStateObject(rowState));

        return [
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                        <h1>stemjs v0.2.70</h1>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="run" onClick={() => this.run()}>Create 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="runlots" onClick={() => this.runLots()}>Create 10,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="add" onClick={() => this.add()}>Append 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="update" onClick={() => this.update()}>Update every 10th row</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="clear" onClick={() => this.clear()}>Clear</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="swaprows" onClick={() => this.swapRows()}>Swap Rows</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
            <table ref="table" className="table table-hover table-striped test-data">
                <tbody ref="tbody">
                    {rows}
                </tbody>
            </table>,
            <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>,
        ];
    }

    onMount() {
        rowStore.addCreateListener((object) => this.tbody.appendChild(this.rowFromStateObject(object)));
        rowStore.addDeleteListener((object) => this.tbody.eraseChild(this["row" + object.id]));
    }
}

let benchmarkElement = BenchmarkElement.create(document.body);
