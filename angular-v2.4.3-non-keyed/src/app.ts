
import { Component, NgModule, AfterViewChecked } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'

interface Data {
    id: number;
    label: string;
}

let startTime : number;
let lastMeasure: string;
let startMeasure = function(name: string) {
    startTime = performance.now();
    lastMeasure = name;
}
let stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

@Component({
  selector: 'my-app',
  templateUrl: './app.html'
})
export class App implements AfterViewChecked {
	data: Array<Data> = [];
    selected: number = undefined;
    id: number = 1;
    backup: Array<Data> = undefined;

    constructor() {
    }

    buildData(count: number = 1000): Array<Data> {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data : Array<Data> = [];
        for (var i = 0; i < count; i++) {
            data.push({id: this.id, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
            this.id++;
        }
        return data;
    }

    _random(max: number) {
        return Math.round(Math.random()*1000)%max;
    }

    itemByIndex(index: number, item: Data) {
      return index; 
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
         if(this.data[i].id === item.id) {
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
        for (let i=0;i<this.data.length;i+=10) {
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
    	if(this.data.length > 10) {
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
export class AppModule {}
