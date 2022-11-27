import { ChangeDetectorRef, Component } from '@angular/core';

interface Data {
    id: number;
    label: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: []
})
export class AppComponent {
    data: Array<Data> = [];
    selected: number = undefined;
    id: number = 1;
    backup: Array<Data> = undefined;
    version: string;

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

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
        event.preventDefault();
        this.selected = item.id;
        this.changeDetectorRef.detectChanges();
    }

    delete(item: Data, event: Event) {
        event.preventDefault();
        for (let i = 0, l = this.data.length; i < l; i++) {
            if (this.data[i].id === item.id) {
                this.data.splice(i, 1);
                break;
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    run() {
        this.data = this.buildData();
        this.changeDetectorRef.detectChanges();
    }

    add() {
        this.data = this.data.concat(this.buildData(1000));
        this.changeDetectorRef.detectChanges();
    }

    update() {
        for (let i = 0; i < this.data.length; i += 10) {
            this.data[i].label += ' !!!';
        }
        this.changeDetectorRef.detectChanges();
    }
    runLots() {
        this.data = this.buildData(10000);
        this.selected = undefined;
        this.changeDetectorRef.detectChanges();
    }
    clear() {
        this.data = [];
        this.selected = undefined;
        this.changeDetectorRef.detectChanges();
    }
    swapRows() {
        if (this.data.length > 998) {
            var a = this.data[1];
            this.data[1] = this.data[998];
            this.data[998] = a;
        }
        this.changeDetectorRef.detectChanges();
    }
}