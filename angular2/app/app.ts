import {bootstrap}    from 'angular2/platform/browser'
import {Component, View} from 'angular2/core';

@Component({
    selector: 'my-app'
})
@View({
    templateUrl: 'template.html'
})
class MyAppComponent {
    data: Array<any> = [];
    selected: string = undefined;
    start: number = 0;
    id: number = 1;

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

    printDuration() {
        setTimeout(() => {
            let duration = Math.round(performance.now()-this.start);
            document.getElementById("duration").innerHTML = duration + " ms";
        });
    }

    _random(max: number) {
        return Math.round(Math.random()*1000)%max;
    }

    select(item, event) {
        this.start = performance.now();
        event.preventDefault();
        this.selected = item.id;
        this.printDuration();
    }

    delete(item, event) {
        this.start = performance.now();
        event.preventDefault();
        const idx = this.data.findIndex(d => d.id===item.id);
        this.data.splice(idx, 1);
        this.printDuration();
    }

    run(event) {
        this.start = performance.now();
        this.data = this.buildData();
        this.printDuration();
    }

    add(event) {
        this.start = performance.now();
        this.data = this.data.concat(this.buildData(10));
        this.printDuration();
    }

    update(event) {
        this.start = performance.now();
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += '.';
        }
        this.printDuration();
    }

}

bootstrap(MyAppComponent);