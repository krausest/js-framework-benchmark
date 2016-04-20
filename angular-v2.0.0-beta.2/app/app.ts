import {bootstrap}    from 'angular2/platform/browser'
import {Component, View, enableProdMode, AfterViewChecked} from 'angular2/core';

enableProdMode();

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

@Component({
    selector: 'my-app'
})
@View({
    templateUrl: 'template.html'
})
class MyAppComponent implements AfterViewChecked {
    data: Array<any> = [];
    selected: string = undefined;
    id: number = 1;
    backup: Array<any> = undefined;

    constructor() {
    }
    buildData(count: number = 1000): Array<string> {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({id: this.id, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
            this.id++;
        }
        return data;
    }
    public ngAfterViewChecked() {
        stopMeasure();
    }

    printDuration() {
    }

    _random(max: number) {
        return Math.round(Math.random()*1000)%max;
    }

    select(item, event) {
        startMeasure("select");
        event.preventDefault();
        this.selected = item.id;
        this.printDuration();
    }

    delete(item, event) {
        startMeasure("delete");
        event.preventDefault();
        const idx = this.data.findIndex(d => d.id===item.id);
        this.data.splice(idx, 1);
        this.printDuration();
    }

    run(event) {
        startMeasure("run");
        this.data = this.buildData();
        this.printDuration();
    }

    add(event) {
        startMeasure("add");
        this.data = this.data.concat(this.buildData(1000));
        this.printDuration();
    }

    update(event) {
        startMeasure("update");
        /* For angular 2 this appears to be way faster */
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += ' !!!';
        }
        /*for (let i=0;i<this.data.length;i+=10) {
            this.data[i] = {id: this.data[i].id, label: this.data[i].label + ' !!!'};
        }*/
        this.printDuration();
    }
    
    hideAll() {
    	startMeasure("hideAll");
    	this.backup = this.data;
        this.data = [];
        this.selected = undefined;
        this.printDuration();
    }
    showAll() {
    	startMeasure("showAll");
        this.data = this.backup;
        this.backup = null;
        this.selected = undefined;
        this.printDuration();
    }
    runLots() {
    	startMeasure("runLots");
        this.data = this.buildData(10000);
        this.selected = undefined;
        this.printDuration();
    }
    clear() {
    	startMeasure("clear");
        this.data = [];
        this.selected = undefined;
        this.printDuration();
    }
    swapRows() {
    	startMeasure("clear");
    	if(this.data.length > 10) {
    		var a = this.data[4];
    		this.data[4] = this.data[9];
    		this.data[9] = a;
    	}
    	this.printDuration();
    }
}

bootstrap(MyAppComponent);