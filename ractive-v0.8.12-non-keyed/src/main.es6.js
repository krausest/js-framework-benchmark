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

let id = 1;
function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}
function buildData(count = 1000) {
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    var data = [];
    for (var i = 0; i < count; i++)
        data.push({ id: id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
    return data;
}

var ractive = window.r = new Ractive({
    oninit : function(options) {
        const that = this;
        this.on( 'run', function ( event) {
            startMeasure("run");
            this.set('data', buildData());
            that.set("selected", undefined);
            stopMeasure();
        });
        this.on( 'add', function ( event) {
            startMeasure("add");
            this.splice('data', this.get('data').length, 0, ...buildData(1000));
            stopMeasure();
        });
        this.on( 'partialUpdate', function ( event) {
           startMeasure("update");
            for (let i=0;i<this.get('data').length;i+=10) {
                this.set(`data[${i}].label`,  this.get('data')[i].label +' !!!');
            }
           stopMeasure();
        });
        this.on('select', function (event, id) {
            startMeasure("select");
            that.set("selected", id);
            stopMeasure();
        });
        this.on('runLots', function (event) {
            startMeasure("runLots");
            this.set('data', buildData(10000));
            that.set("selected", undefined);
            stopMeasure();
        });
        this.on('clear', function (event) {
            startMeasure("clear");
            this.splice('data', 0, this.get('data').length);
            stopMeasure();
        });
        this.on('swapRows', function (event) {
            startMeasure("swapRows");
            if(this.get('data').length > 10) {
                var a = this.get('data')[4];
                this.set('data[4]',  this.get('data')[9]);
                this.set('data[9]',  a);
            }
            stopMeasure();            
        });
    },
    remove(idx) {
        startMeasure("delete");
        for(let i=this.get('data').length-1; i>idx; i--) {
            this.set(`data[${i-1}]`,  this.get('data')[i]);
        }
        this.splice('data', this.get('data').length-1, 1);
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
                <h1>Ractive v0.8.12</h1>
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
            {{#each data:num}}
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
    data: { 
        data: [],
        selected: undefined
    }
});

