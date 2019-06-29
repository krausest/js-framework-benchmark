'use strict';
import { get, set } from 'xsm';

var startTime;
var lastMeasure;
export function startMeasure(name) {
    startTime = performance.now();
    lastMeasure = name;
}

export function stopMeasure() {
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

var rowstr = 'rows';
var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

export class Store {
    constructor() {
        this.id = 1;
    }
    buildData(count = 1000, add) {
        var data = new Array(count);
        for (var i = 0; i < count; i++)
            data[i] = {id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] };
        if( !add ) {
            set(rowstr, data);
        } else {
            let rows = get('rows')
            if( !rows ) 
                set('rows', data);
            else
                set('rows', rows.concat(data));
        }
    }
    run() {
        this.buildData();
    }
    add() {
        this.buildData(1000, true);
    }
    update() {
        var newData = get('rows');

        for (let i = 0; i < newData.length; i += 10) {
            newData[i].label += ' !!!';
        }
        set('rows', newData);
    }
    runLots() {
        this.buildData(10000);
    }
    clear() {
        set('rows', []);
    }
    swapRows() {
        let data = get('rows');
    	if(data.length > 998) {
    		let d1 = data[1];
            data[1] = data[998];
            data[998] = d1;
            set('rows', data);
    	}
    }
}
