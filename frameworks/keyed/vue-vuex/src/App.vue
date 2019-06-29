<template>
    <div class="container">
        <div class="jumbotron">
            <div class="row">
                <div class="col-md-6">
                    <h1>Vue.js+VUEX (keyed)</h1>
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
import mytable from './table.vue';

var startTime, lastMeasure;

function startMeasure(name) {
    startTime = performance.now();
    lastMeasure = name;
}

function stopMeasure() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

let id=1;

export default {
    components: {
        mytable,
    },
    methods: {
        buildData(count = 1000, add) {
            var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
            var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
            var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
            var data = new Array(count);
            for (var i = 0; i < count; i++)
                data[i] = {id: id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] };
            return Object.freeze(data);
        },
        add(e) {
            startMeasure("add");
            this.$store.commit('Rows', Object.freeze([...this.$store.getters.Rows].concat(this.buildData())));
            e.stopPropagation();
            stopMeasure();
        },
        run(e) {
            startMeasure("run");
            this.$store.commit('Rows', this.buildData());
            e.stopPropagation();
            stopMeasure();
        },
        update() {
            startMeasure("update");
            let rows = [...this.$store.getters.Rows];
            for (let i = 0; i < rows.length; i += 10) {
                rows[i].label += ' !!!';
            }
            this.$store.commit('Rows', Object.freeze(rows));
            stopMeasure();
        },
        runLots() {
            //startMeasure("runLots");
            this.$store.commit('Rows', this.buildData(10000));
            //stopMeasure();
        },
        clear(e) {
            startMeasure("clear");
            this.$store.commit('Rows', Object.freeze([]));
            e.stopPropagation();
            stopMeasure();
        },
        swapRows() {
            startMeasure("swapRows");
            let data = [...this.$store.getters.Rows];
            if(data.length > 998) {
                let d1 = data[1];
                data[1] = data[998];
                data[998] = d1;
                this.$store.commit('Rows', Object.freeze(data));
            }
            stopMeasure();
        },
    }
}
</script>
