<template>
    <div class="container">
        <div class="jumbotron">
            <div class="row">
                <div class="col-md-6">
                    <h1>Vue.js+XSM (keyed)</h1>
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
        <mytable></mytable>
        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
</template>

<script>
import { startMeasure, stopMeasure, Store } from './store';
import mytable from './table.vue';
import { setcfg } from 'xsm';

setcfg({framework: 'Vue'});
var store = new Store();

export default {
    components: {
        mytable,
    },

    methods: {
        add(e) {
            startMeasure("add");
            store.add();
            e.stopPropagation();
            stopMeasure();
        },
        run(e) {
            startMeasure("run");
            store.run();
            e.stopPropagation();
            stopMeasure();
        },
        update() {
            startMeasure("update");
            store.update();
            stopMeasure();
        },
        runLots() {
            //startMeasure("runLots");
            store.runLots();
            //stopMeasure();
        },
        clear(e) {
            startMeasure("clear");
            store.clear();
            e.stopPropagation();
            stopMeasure();
        },
        swapRows() {
            startMeasure("swapRows");
            store.swapRows();
            stopMeasure();
        },
    }
}
</script>
