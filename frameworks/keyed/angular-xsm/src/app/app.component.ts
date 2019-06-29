import { Component, VERSION } from '@angular/core';
import {get,set,setcfg} from 'xsm'

setcfg({framework: 'Angular', debug: false});

interface Data {
    id: number;
    label: string;
}

let startTime: number;
let lastMeasure: string;
let startMeasure = function (name: string) {
    startTime = performance.now();
    lastMeasure = name;
}
let stopMeasure = function () {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last + " took " + (stop - startTime));
        }, 0);
    }
}

var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

@Component({
    styleUrls: ['./currentStyle.css'],
    selector: 'app-root',
    template: `<div class="container">
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>Angular XSM keyed</h1>
            </div>
            <div class="col-md-6">
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="run" (click)="run()" ref="text">Create 1,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="runlots" (click)="runLots()">Create 10,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="add" (click)="add()" ref="text">Append 1,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="update" (click)="update()">Update every 10th row</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="clear" (click)="clear()">Clear</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="swaprows" (click)="swapRows()">Swap Rows</button>
                </div>
            </div>
        </div>
    </div>
    <app-table></app-table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>`
})
export class AppComponent {
    id: number = 1;

    constructor() {
        console.info(VERSION.full);
    }

    buildData(count: number = 1000, add?: boolean) {
        var data: Array<Data> = [];
        for (var i = 0; i < count; i++) {
            data.push({ id: this.id++, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
        }
        if( add ) {
            let rows =  get('rows');
            if( rows ) {
                rows.push(...data);
            } else {
                set('rows', data);
            }
        } else {
            set('rows', data);
        }
    }

    _random(max: number) {
        return Math.round(Math.random() * 1000) % max;
    }


    run() {
        this.buildData(1000);
    }

    add() {
        this.buildData(1000, true);
    }

    update() {
        let data = get('rows');
        for (let i = 0; i < data.length; i += 10) {
            data[i].label += ' !!!';
        }
    }
    runLots() {
        this.buildData(10000);
    }
    clear() {
        set('rows', []);
    }
    swapRows() {
        let data = get('rows');
        if (data.length > 998) {
            var a = data[1];
            data[1] = data[998];
            data[998] = a;
        }
    }
}
