<template>
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>Vue.js 3.0.0-alpha4 (keyed)</h1>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-6 smallpad">
                      <button type="button" class="btn btn-primary btn-block" id="run" @click="run">Create 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="runlots" @click="runLots">Create 10,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="add" @click="add">Append 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="update" @click="update">Update every 10th row</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="clear" @click="clear">Clear</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="swaprows" @click="swapRows">Swap Rows</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <table class="table table-hover table-striped test-data">
        <tbody>
            <tr
                v-for="row in rows"
                :key="row.id"
                :class="{'danger': row.id === selected}">
                <td class="col-md-1">{{row.id}}</td>
                <td class="col-md-4">
                    <a @click="select(row.id)">{{row.label}}</a>
                </td>
                <td class="col-md-1">
                    <a @click="remove(row.id)">
                        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </a>
                </td>
                <td class="col-md-6"></td>
            </tr>
        </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</template>

<script>
let startTime;
let lastMeasure;
const startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
};
const stopMeasure = function() {
    const last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            const stop = performance.now();
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
};
function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

export default {
    data: () => ({
        rows: [],
        selected: undefined,
        id: 1,
    }),
    methods: {
        buildData(count = 1000) {
            const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
            const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
            const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
            const data = [];
            for (let i = 0; i < count; i++)
                data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
            return data;
        },

        add() {
            startMeasure("add");
            this.rows = this.rows.concat(this.buildData(1000));
            stopMeasure();
        },
        remove(id) {
            startMeasure("remove");
            this.rows.splice(this.rows.findIndex(d => d.id === id), 1);
            stopMeasure();
        },
        select(id) {
            startMeasure("select");
            this.selected = id;
            stopMeasure();
        },
        run() {
            startMeasure("run");
            this.rows = this.buildData();
            this.selected = undefined;
            stopMeasure();
        },
        update() {
            startMeasure("update");
            for (let i = 0; i < this.rows.length; i += 10) {
                this.rows[i].label += ' !!!';
            }
            stopMeasure();
        },
        runLots() {
            startMeasure("runLots");
            this.rows = this.buildData(10000);
            this.selected = undefined;
            stopMeasure();
        },
        clear() {
            startMeasure("clear");
            this.rows = [];
            this.selected = undefined;
            stopMeasure();
        },
        swapRows() {
            startMeasure("swapRows");
            if (this.rows.length > 998) {
                const d1 = this.rows[1];
                const d998 = this.rows[998];

                this.rows[1] = d998;
                this.rows[998] = d1;
            }
            stopMeasure();
        },

    }
}
</script>
