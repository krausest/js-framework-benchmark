
import { Component, NgModule, AfterViewChecked, VERSION } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'

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

@Component({
    selector: 'my-app',
    template: `<div class="container">
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>Angular v4.1.2</h1>
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
    <table class="table table-hover table-striped test-data">
        <tbody>
            <tr [class.danger]="item.id === selected" *ngFor="let item of data trackBy itemById">
                <td class="col-md-1">{{item.id}}</td>
                <td class="col-md-4">
                    <a href="#" (click)="select(item, $event)">{{item.label}}</a>
                </td>
                <td class="col-md-1"><a href="#" (click)="delete(item, $event)"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                <td class="col-md-6"></td>
            </tr>
        </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>`
})
export class App implements AfterViewChecked {
    data: Array<Data> = [];
    selected: number = undefined;
    id: number = 1;
    backup: Array<Data> = undefined;

    constructor() {
        console.info(VERSION.full);
    }

    buildData(count: number = 1000): Array<Data> {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data: Array<Data> = [];
        for (var i = 0; i < count; i++) {
            data.push({ id: this.id, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
            this.id++;
        }
        return data;
    }

    _random(max: number) {
        return Math.round(Math.random() * 1000) % max;
    }

    itemById(index: number, item: Data) {
        return item.id;
    }

    select(item: Data, event: Event) {
        startMeasure("select");
        event.preventDefault();
        this.selected = item.id;
    }

    delete(item: Data, event: Event) {
        event.preventDefault();
        startMeasure("delete");
        for (let i = 0, l = this.data.length; i < l; i++) {
            if (this.data[i].id === item.id) {
                this.data.splice(i, 1);
                break;
            }
        }
    }

    run() {
        startMeasure("run");
        this.data = this.buildData();
    }

    add() {
        startMeasure("add");
        this.data = this.data.concat(this.buildData(1000));
    }

    update() {
        startMeasure("update");
        for (let i = 0; i < this.data.length; i += 10) {
            this.data[i].label += ' !!!';
        }
    }
    runLots() {
        startMeasure("runLots");
        this.data = this.buildData(10000);
        this.selected = undefined;
    }
    clear() {
        startMeasure("clear");
        this.data = [];
        this.selected = undefined;
    }
    swapRows() {
        startMeasure("swapRows");
        if (this.data.length > 10) {
            var a = this.data[4];
            this.data[4] = this.data[9];
            this.data[9] = a;
        }
    }
    ngAfterViewChecked() {
        stopMeasure();
    }
}

@NgModule({
    imports: [BrowserModule],
    declarations: [App],
    bootstrap: [App]
})
export class AppModule { }
