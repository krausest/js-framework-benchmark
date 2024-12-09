import { NgFor } from '@angular/common';
import { Component, VERSION } from '@angular/core';

interface Data {
    id: number;
    label: string;
}

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        

@Component({
    selector: 'app-root',
    imports: [NgFor],
    templateUrl: './app.component.html'
})
export class AppComponent {
    data: Array<Data> = [];
    selected?: number = undefined;
    id: number = 1;
    backup?: Array<Data> = undefined;
    version = VERSION.full;

    buildData(count: number = 1000): Array<Data> {
        var data: Array<Data> = new Array(count);
        for (var i = 0; i < count; i++) {
            data[i]={ id: this.id, label: `${adjectives[this._random(adjectives.length)]} ${colours[this._random(colours.length)]} ${nouns[this._random(nouns.length)]}` };
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
        event.preventDefault();
        this.selected = item.id;
    }

    delete(item: Data, event: Event) {
        event.preventDefault();
        for (let i = 0, l = this.data.length; i < l; i++) {
            if (this.data[i].id === item.id) {
                this.data.splice(i, 1);
                break;
            }
        }
    }

    run() {
        this.data = this.buildData();
    }

    add() {
        this.data = this.data.concat(this.buildData(1000));
    }

    update() {
        for (let i = 0; i < this.data.length; i += 10) {
            this.data[i].label += ' !!!';
        }
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
        if (this.data.length > 998) {
            var a = this.data[1];
            this.data[1] = this.data[998];
            this.data[998] = a;
        }
    }
}
