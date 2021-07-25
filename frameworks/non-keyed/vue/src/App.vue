<template>
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>Vue.js (non-keyed)</h1>
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
import { ref, markRaw } from 'vue';

let ID = 1;
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

function buildData(count = 1000) {
    const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    const data = [];
    for (let i = 0; i < count; i++)
        data.push({id: ID++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
    return data;
}

export default {
    setup() {
        const selected = ref(null);
        const rows = ref([]);

        function setRows(update = rows.value.slice()) {
          rows.value = markRaw(update)
        }

        function add() {
            startMeasure("add");
            setRows(rows.value.concat(buildData(1000)));
            stopMeasure();
        }

        function remove(id) {
            startMeasure("remove");
            rows.value.splice(rows.value.findIndex(d => d.id === id), 1);
            setRows();
            stopMeasure();
        }

        function select(id) {
            startMeasure("select");
            selected.value = id;
            stopMeasure();
        }

        function run() {
            startMeasure("run");
            setRows(buildData());
            selected.value = undefined;
            stopMeasure();
        }

        function update() {
            startMeasure("update");
            for (let i = 0; i < rows.value.length; i += 10) {
                rows.value[i].label += ' !!!';
            }
            setRows();
            stopMeasure();
        }

        function runLots() {
            startMeasure("runLots");
            setRows(buildData(10000));
            selected.value = undefined;
            stopMeasure();
        }

        function clear() {
            startMeasure("clear");
            setRows([]);
            selected.value = undefined;
            stopMeasure();
        }

        function swapRows() {
            startMeasure("swapRows");

            if (rows.value.length > 998) {
                const d1 = rows.value[1];
                const d998 = rows.value[998];

                rows.value[1] = d998;
                rows.value[998] = d1;

                setRows();
            }
            stopMeasure();
        }

        return {
            rows,
            selected,
            run,
            clear,
            swapRows,
            runLots,
            update,
            select,
            remove,
            add,
        }
    }
}
</script>
