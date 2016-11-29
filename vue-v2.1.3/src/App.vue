<template>
    <div class="container">
        <div class="jumbotron">
            <div class="row">
                <div class="col-md-6">
                    <h1>Vue.js v2.1.3</h1>
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
        <my-table
            :rows="rows"
            :selected="selected"
            @select="select"
            @remove="remove">
        </my-table>
        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
</template>

<script>
import { Store } from './store';
import MyTable from './Table.vue';

var store = new Store();

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

export default {
    components: {
        MyTable
    },
    data: () => ({
        rows: store.data,
        selected: store.selected
    }),
    methods: {
        add() {
            startMeasure("add");
            store.add();
            this.rows = store.data;
            this.selected = store.selected;
            stopMeasure();
        },
        remove(item) {
            startMeasure("remove");
            store.delete(item.id);
            this.rows = store.data;
            this.selected = store.selected;
            stopMeasure();
        },
        select(item) {
            startMeasure("select");
            store.select(item.id);
            this.rows = store.data;
            this.selected = store.selected;
            stopMeasure();
        },
        run() {
            startMeasure("run");
            store.run();
            this.rows = store.data;
            this.selected = store.selected;
            stopMeasure();
        },
        update() {
            startMeasure("update");
            store.update();
            this.rows = store.data;
            this.selected = store.selected;
            stopMeasure();
        },
        runLots() {
            startMeasure("runLots");
            store.runLots();
            this.rows = store.data;
            this.selected = store.selected;
            stopMeasure();
        },
        clear() {
            startMeasure("clear");
            store.clear();
            this.rows = store.data;
            this.selected = store.selected;
            stopMeasure();
        },
        swapRows() {
            startMeasure("swapRows");
            store.swapRows();
            this.rows = store.data;
            this.selected = store.selected;
            stopMeasure();
        }
    }
}
</script>
