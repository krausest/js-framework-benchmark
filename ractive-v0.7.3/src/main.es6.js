'use strict';

require('babel-core/lib/babel/polyfill');

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
        this.data = this.data.concat(this.buildData(1000));
    }
    hideAll() {
    	this.backup = this.data;
        this.data = [];
        this.selected = undefined;
    }
    showAll() {
        this.data = this.backup;
        this.backup = null;
        this.selected = undefined;
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


var ractive = new Ractive({
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
        this.on('delete', function (event, id) {
            startMeasure("delete");
            store.delete(id);
            stopMeasure();
        });
        this.on('hideAll', function (event) {
            startMeasure("hideAll");
            store.hideAll();
            this.set("store", store);
            stopMeasure();
        });
        this.on('showAll', function (event) {
            startMeasure("showAll");
            store.showAll();
            this.set("store", store);
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
    el: "#main",
    template:
    `<div class="jumbotron">
        <div class="row">
            <div class="col-md-8">
                <h1>Ractive v0.7.3</h1>
            </div>
            <div class="col-md-4">
                <button type="button" class="btn btn-primary btn-block" id="add" on-click="add">Add 1000 rows</button>
                <button type="button" class="btn btn-primary btn-block" id="run" on-click="run">Create 1000 rows</button>
                <button type="button" class="btn btn-primary btn-block" id="update" on-click="partialUpdate">Update every 10th row</button>
                <button type="button" class="btn btn-primary btn-block" id="hideall" on-click="hideAll">HideAll</button>
                <button type="button" class="btn btn-primary btn-block" id="showall" on-click="showAll">ShowAll</button>
                <button type="button" class="btn btn-primary btn-block" id="runlots" on-click="runLots">Create lots of rows</button>
                <button type="button" class="btn btn-primary btn-block" id="clear" on-click="clear">Clear</button>
                <button type="button" class="btn btn-primary btn-block" id="swaprows" on-click="swapRows">Swap Rows</button>
                <h3 id="duration"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>&nbsp;</h3>
            </div>
        </div>
    </div>
    <table class="table table-hover table-striped test-data">
        <tbody>
            {{#each store.data:num}}
            <tr class="{{ selected == id ? 'danger' : '' }}">
                <td class="col-md-1">{{id}}</td>
                <td class="col-md-4">
                    <a on-click="select:{{id}}">{{label}}</a>
                </td>
                <td class="col-md-1"><a on-click="delete:{{id}}"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                <td class="col-md-6"></td>
            </tr>
            {{/each}}
        </tbody>
    </table>
    `
    ,
    data: { store: store, selected: undefined}
});

