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

var id = 1;

module.exports = {
    onCreate() {
        this.state = {
            selected: null,
            data: []
        };
    },
    onUpdate() {
        stopMeasure();
    },
    buildData(count=1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({id: id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    },
    run() {
        startMeasure("run");
        this.state.data = this.buildData();
        this.state.selected = null;
    },
    runLots() {
        startMeasure("runLots");
        this.state.data = this.buildData(10000);
        this.state.selected = null;
    },
    add() {
        startMeasure("add");
        this.state.data = this.state.data.concat(this.buildData());
    },
    update() {
        startMeasure("update");
        let d = this.state.data;
        for (let i=0;i<d.length;i+=10) {
            d[i] = Object.assign({}, d[i], {label: d[i].label + ' !!!'});
        }
        this.forceUpdate();
    },
    clear() {
        startMeasure("clear");
        this.state.data = [];
        this.selected = null;
    },
    swapRows() {
        startMeasure("swapRows");
        let data = this.state.data;

    	if(data.length > 10) {
    		var a = data[1];
    		data[1] = data[998];
    		data[998] = a;
        }
        this.forceUpdate();
    },
    delete(item) {
        startMeasure("delete");
        var id = item.id;
        var data = this.state.data;
        var idx = data.findIndex(d => d.id === id);
        data.splice(idx, 1);
        this.forceUpdate();
    },
    select(item) {
        startMeasure("select");
        this.state.selected = item.id;
    }
};
