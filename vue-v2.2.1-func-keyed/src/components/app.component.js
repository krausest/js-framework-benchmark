import { default as Vue } from 'vue';

import { Store } from '../services/store.service';

var store = new Store();

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
            console.log(last + " took " + (stop - startTime));
        }, 0);
    }
}

Vue.component('app-vue', {
    data() {
        return {
            rows: store.data,
            selected: store.selected
        }
    },
    methods: {
        handleClick(e) {
            const { action, id } = e.target.dataset
            if (action && id) {
                this[action](id)
            }
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
            store.select(id);
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
            this.rows = Object.freeze(store.data);
            this.selected = store.selected;
        }
    },
    template: `<div class="container">
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>Vue.js v2.2.1 (functional components)</h1>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="run" v-on:click="run">Create 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="runlots" v-on:click="runLots">Create 10,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="add" v-on:click="add">Append 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="update" v-on:click="update">Update every 10th row</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="clear" v-on:click="clear">Clear</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="swaprows" v-on:click="swapRows">Swap Rows</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <vue-table :items="rows" :selected="selected" :on-click="handleClick"></vue-table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>`
});
