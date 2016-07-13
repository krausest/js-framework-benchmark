'use strict';

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

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
            var duration = 0;
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

export class Store {
    constructor() {
        this.data = [];
        this.selected = undefined;
        this.id = 1;
    }
    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    }
    updateData(mod = 10) {
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += ' !!!';
        }
    }
    delete(id) {
        startMeasure("delete");
        const idx = this.data.findIndex(d => d.id==id);
        this.data.splice(idx, 1);
        stopMeasure();
        return this;
    }
    run() {
        startMeasure("run");
        this.data = this.buildData();
        this.selected = undefined;
        stopMeasure();
    }
    add() {
        startMeasure("add");
        this.data = this.data.concat(this.buildData(1000));
        this.selected = undefined;
        stopMeasure();
    }
    update() {
        startMeasure("update");
        this.updateData();
        this.selected = undefined;
        stopMeasure();
    }
    select(id) {
        startMeasure("select");
        this.selected = id;
        stopMeasure();
    }
    runLots() {
        startMeasure("runLots");
        this.data = this.buildData(10000);
        this.selected = undefined;
        stopMeasure();
    }
    clear() {
        startMeasure("clear");
        this.data = [];
        this.selected = undefined;
        stopMeasure();
    }
    swapRows() {
        startMeasure("swapRows");
        if(this.data.length > 10) {
            var a = this.data[4];
            this.data[4] = this.data[9];
            this.data[9] = a;
        }
        stopMeasure();
    }
}