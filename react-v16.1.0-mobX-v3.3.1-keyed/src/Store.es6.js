'use strict';

var {observer} = require("mobx-react");
var {observable, computed, action} = require ("mobx");

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

let id = 1;

class Row {
    id = 0;
    store;
    @observable label = "";
    @computed get isSelected() {
        return this.store.selected === this;
    }
}

function row(store, label, _id) {
    let r = new Row();
    if (_id) {
        r.id = _id;
    } else {
        r.id = id++;
    }
    r.label = label;
    r.store = store;
    return r;
}

export class Store {
    @observable data = [];
    @observable selected = null;

    @action buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push(row(this, adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] ));
        return data;
    }
    @action updateData(mod = 10) {
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label = this.data[i].label + ' !!!';
        }
    }
    @action delete(row) {
        const idx = this.data.indexOf(row);
        this.data.splice(idx, 1);
    }
    @action run() {
        this.data = this.buildData();
        this.selected = undefined;
    }
    @action add() {
        this.data = this.data.concat(this.buildData(1000));
    }
    @action update() {
        this.updateData();
    }
    @action select(row) {
        this.selected = row;
    }
    @action runLots() {
        this.data = this.buildData(10000);
        this.selected = undefined;
    }
    @action clear() {
        this.data = [];
        this.selected = undefined;
    }
    @action swapRows() {
    	if(this.data.length > 10) {
    		var a = this.data[1];
    		this.data[1] = this.data[998];
    		this.data[998] = a;
    	}
    }
}