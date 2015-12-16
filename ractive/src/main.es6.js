'use strict';

require('babel-core/lib/babel/polyfill');

const Ractive = require('ractive');
Ractive.DEBUG = /unminified/.test(function(){/*unminified*/});

class DataStore {
    constructor() {
        this.data = [];
        this.date = performance.now();
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
        this.date = performance.now();
        this.selected = id;
    }
    update() {
        this.date = performance.now();
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += '.';
        }
    }
    delete(id) {
        this.date = performance.now();
        const idx = this.data.findIndex(d => d.id==id);
        this.data.splice(idx, 1);
    }
    run() {
        this.date = performance.now();
        this.data = this.buildData();
    }
    add() {
        this.date = performance.now();
        this.data = this.data.concat(this.buildData(10));
    }
}

const store = new DataStore();

var timeOut = function() {
    window.setTimeout(e => {
        document.getElementById("duration").innerHTML = Math.round(performance.now() - store.date) + " ms";
    }, 8);
}

var ractive = new Ractive({
    oninit : function(options) {
        const that = this;
        this.on( 'run', function ( event) {
            timeOut();
            store.run();
            this.set("store", store);
        });
        this.on( 'add', function ( event) {
            timeOut();
            store.add();
            this.set("store", store);
        });
       this.on( 'partialUpdate', function ( event) {
           timeOut();
            store.update();
            this.set("store", store);
        });
        this.on('select', function (event, id) {
            store.select(id);
            that.set("selected", store.selected);
            timeOut();
            console.log("selected ",id);
        });
        this.on('delete', function (event, id) {
            store.delete(id);
            timeOut();
        });
    },
    el: "#main",
    template:
    `<div class="jumbotron">
        <div class="row">
            <div class="col-md-8">
                <h1>Ractive</h1>
            </div>
            <div class="col-md-4">
                <button type="button" class="btn btn-primary btn-block" id="add" on-click="add">Add 10 rows</button>
                <button type="button" class="btn btn-primary btn-block" id="run" on-click="run">Create 1000 rows</button>
                <button type="button" class="btn btn-primary btn-block" id="update" on-click="partialUpdate">Update every 10th row</button>
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

