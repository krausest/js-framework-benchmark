'use strict';

const Ractive = require('ractive');
Ractive.DEBUG = /unminified/.test(function(){/*unminified*/});

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

class DataStore {
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
            data.push({ id: this.id++, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
        return data;
    }
    _random(max) {
        return Math.round(Math.random() * 1000) % max;
    }
    select(id) {
        this.selected = id;
    }
    update() {
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += ' !!!';
        }
    }
    delete(id) {
        const idx = this.data.findIndex(d => d.id==id);
        this.data.splice(idx, 1);
    }
    run() {
        this.data = this.buildData();
    }
    add() {
        this.data.push.apply(this.data, this.buildData(1000));
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
    	if(this.data.length > 10) {
    		var a = this.data[4];
    		this.data[4] = this.data[9];
    		this.data[9] = a;
    	}
    }
}

const store = new DataStore();


var ractive = window.r = new Ractive({
    oninit : function(options) {
        const that = this;
        this.on( 'run', function ( event) {
            startMeasure("run");
            store.run();
            this.set("store", store);
            stopMeasure();
        });
        this.on( 'add', function ( event) {
            startMeasure("add");
            store.add();
            this.set("store", store);
            stopMeasure();
        });
        this.on( 'partialUpdate', function ( event) {
           startMeasure("update");
           store.update();
           this.set("store", store);
           stopMeasure();
        });
        this.on('select', function (event, id) {
            startMeasure("select");
            store.select(id);
            that.set("selected", store.selected);
            stopMeasure();
        });
        this.on('runLots', function (event) {
            startMeasure("runLots");
            store.runLots();
            this.set("store", store);
            stopMeasure();
        });
        this.on('clear', function (event) {
            startMeasure("clear");
            store.clear();
            this.set("store", store);
            stopMeasure();
        });
        this.on('swapRows', function (event) {
            startMeasure("swapRows");
            store.swapRows();
            this.set("store", store);
            stopMeasure();
        });
    },
    remove(idx) {
        startMeasure("delete");
        this.splice('store.data', idx, 1);
        stopMeasure();
    },
    select(id) {
        startMeasure("select");
        this.set("selected", id);
        stopMeasure();
    },
    el: "#main",
    template:
    `<div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>Ractive v0.8.9</h1>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="run" on-click="run">Create 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="runlots" on-click="runLots">Create 10,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="add" on-click="add">Append 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="update" on-click="partialUpdate">Update every 10th row</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="clear" on-click="clear">Clear</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="swaprows" on-click="swapRows">Swap Rows</button>
                    </div>
               </div>
            </div>
        </div>
    </div>
    <table class="table table-hover table-striped test-data">
        <tbody>
            {{#each store.data:num}}
            <tr class-danger="{{~/selected === .id}}">
                <td class="col-md-1">{{.id}}</td>
                <td class="col-md-4">
                    <a on-click="@this.select(.id)">{{label}}</a>
                </td>
                <td class="col-md-1"><a on-click="@this.remove(num)"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                <td class="col-md-6"></td>
            </tr>
            {{/each}}
        </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    `
    ,
    data: { store: store, selected: undefined}
});

