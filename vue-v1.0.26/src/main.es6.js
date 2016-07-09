'use strict';

var Vue = require('vue');
var {Store} = require('./store');

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

new Vue({
    el: '#main',
    data: {
        rows: store.data,
        selected: store.selected
    },
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
})