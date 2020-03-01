'use strict';

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

var id = 1;

module.exports = {
    onCreate() {
        this.state = {
            selected: null,
            data: []
        };
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
        this.state.data = this.buildData();
        this.state.selected = null;
    },
    runLots() {
        this.state.data = this.buildData(10000);
        this.state.selected = null;
    },
    add() {
        this.state.data = this.state.data.concat(this.buildData());
    },
    update() {
        let d = this.state.data;
        for (let i=0;i<d.length;i+=10) {
            d[i] = Object.assign({}, d[i], {label: d[i].label + ' !!!'});
        }
        this.forceUpdate();
    },
    clear() {
        this.state.data = [];
        this.selected = null;
    },
    swapRows() {
        let data = this.state.data;

    	if(data.length > 998) {
    		var a = data[1];
    		data[1] = data[998];
    		data[998] = a;
        }
        this.forceUpdate();
    },
    delete(item) {
        var id = item.id;
        var data = this.state.data;
        var idx = data.findIndex(d => d.id === id);
        data.splice(idx, 1);
        this.forceUpdate();
    },
    select(item) {
        this.state.selected = item.id;
    }
};
