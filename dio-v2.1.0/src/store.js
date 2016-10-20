var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

var nounsLen = nouns.length,
    adjectivesLen = adjectives.length,
    coloursLen = colours.length;

var startTime,
    lastMeasure;

export function startMeasure(name) {
    startTime = performance.now();
    lastMeasure = name;
}

export function stopMeasure () {
    var last = lastMeasure;
    if (lastMeasure) {
        setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}


function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

export class Store {
    constructor() {
        this.data = [];
        this.selected = undefined;
        this.id = 1;
    }
    buildData(count = 1000) {
        var data = new Array(count);

        for (var i = 0; i < count; i++) {
            data[i] = ({
                id: this.id++,
                label: adjectives[_random(adjectivesLen)] + " " + colours[_random(coloursLen)] + " " + nouns[_random(nounsLen)]
            });
        }

        return data;
    }
    updateData() {
        var data = this.data;
        for (var i = 0, len = data.length; i < len; i = i + 10) {
            data[i].label += " !!!";
        }
    }
    delete(id) {
        var data = this.data;
        var idx = data.findIndex(d => d.id === id);

        if (idx === 0) { data.shift(); }
        else if (idx >= data.length - 1) { data.pop(); }
        else { data.splice(idx, 1); }
    }
    run() {
        this.data = this.buildData();
        this.selected = undefined;
    }
    add() {
        this.data = this.data.concat(this.buildData(1000));
    }
    update() {
        this.updateData();
    }
    select(id) {
        this.selected = id;
    }
    runLots() {
        this.data = this.buildData(10000);
        this.selected = undefined;
    }
    clear() {
        this.data = [];
        this.selected = undefined;
    }
    swapRows() {
        if (this.data.length > 10) {
            var a = this.data[4];
            this.data[4] = this.data[9];
            this.data[9] = a;
        }
    }
}
