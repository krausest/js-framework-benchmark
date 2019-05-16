import {Store} from './store.es6';
import san from 'san/dist/san.spa.modern.js';


var store = new Store();

var startTime;
var lastMeasure;
var startMeasure = function (name) {
    startTime = performance.now();
    lastMeasure = name;
};
var stopMeasure = function () {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            console.log(last + " took " + (stop - startTime));
        }, 0);
    }
};

export default san.defineComponent({
    trimWhitespace: 'all',
    updateMode: 'optimized',
    autoFillStyleAndId: false,
    template:`<div class="container">
        <div class="jumbotron">
            <div class="row">
                <div class="col-md-6">
                    <h1>san (non-keyed)</h1>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-sm-6 smallpad">
                          <button type="button" class="btn btn-primary btn-block" id="run" on-click="run">Create 1,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="runlots" on-click="runLots">Create 10,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="add" on-click="add">Append 1,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="update" on-click="update">Update every 10th row</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="clear" on-click="clear">Clear</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="swaprows" on-click="swapRows">Swap Rows</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <table class="table table-hover table-striped test-data" on-click="handleClick($event)">
            <tbody>
                <tr s-for="item in rows" class="{{item.selected ? 'danger':''}}" data-id="{{item.id}}">
                    <td class="col-md-1">{{item.id}}</td>
                    <td class="col-md-4">
                        <a data-action="select">{{item.label}}</a>
                    </td>
                    <td class="col-md-1">
                        <a>
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"
                                data-action="remove"></span>
                        </a>
                    </td>
                    <td class="col-md-6"></td>
                </tr>
            </tbody>
        </table>
        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>`,
    initData: () => ({
        rows: store.data
    }),
    handleClick(e) {
        let target = e.target;
        const action = target.getAttribute('data-action');

        while (target.tagName !== 'TR') {
            target = target.parentNode;
        }

        this[action](target.getAttribute('data-id'));
    },
    attached() {
        window.app = this;
    },
    add() {
        startMeasure("add");
        store.add();
        this.sync();
        stopMeasure();
    },
    remove(id) {
        startMeasure("remove");
        store.delete(id);
        this.sync();
        stopMeasure();
    },
    select(id) {
        startMeasure("select");
        store.select(+id);
        this.sync();
        stopMeasure();
    },
    run() {
        startMeasure("run");
        store.run();
        this.sync();
        stopMeasure();
    },
    update() {
        startMeasure("update");
        store.update();
        this.sync();
        stopMeasure();
    },
    runLots() {
        startMeasure("runLots");
        store.runLots();
        this.sync();
        stopMeasure();
    },
    clear() {
        startMeasure("clear");
        store.clear();
        this.sync();
        stopMeasure();
    },
    swapRows() {
        startMeasure("swapRows");
        store.swapRows();
        this.sync();
        stopMeasure();
    },
    sync() {
        this.dataChanges = [];
        for (let i = 0; i < store.ops.length; i++) {
            let op = store.ops[i];
            this.data[op.type](op.name, op.arg, op.options);
        }

        for (let i = 0; i < store.fires.length; i++) {
            this.data.fire(store.fires[i])
        }

        store.ops.length = 0;
        store.fires.length = 0;
        this._update();
    }
});


