import { Component, VERSION, signal } from '@angular/core';

interface Data {
    id: number;
    label: string;
}

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
})
export class AppComponent {
    data = signal<Data[]>([]);
    selected = signal<number | undefined>(undefined);
    id = 1;
    backup?: Array<Data> = undefined;
    version = VERSION.full;

    buildData(count: number = 1000): Array<Data> {
        var data: Array<Data> = [];
        for (var i = 0; i < count; i++) {
            data.push({ id: this.id, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
            this.id++;
        }
        return data;
    }


    select(item: Data, event: Event) {
        event.preventDefault();
        this.selected.set(item.id);
    }

    delete(item: Data, event: Event) {
        event.preventDefault();
        let data = this.data();
        for (let i = 0, l = data.length; i < l; i++) {
            if (data[i].id === item.id) {
                data.splice(i, 1);
                break;
            }
        }
        this.data.set(data);
    }

    run() {
        this.data.set(this.buildData());
    }

    add() {
        this.data.set(this.data().concat(this.buildData(1000)));
    }

    update() {
        let data = this.data();
        for (let i = 0; i < data.length; i += 10) {
            data[i].label += ' !!!';
        }
        this.data.set(data);
    }
    runLots() {
        this.data.set(this.buildData(10000));
        this.selected.set(undefined);
    }
    clear() {
        this.data.set([]);
        this.selected.set(undefined);
    }
    swapRows() {
        let data = this.data();
        if (data.length > 998) {
            var a = data[1];
            data[1] = data[998];
            data[998] = a;
        }
        this.data.set(data);
    }

    _random(max: number) {
        return Math.round(Math.random() * 1000) % max;
    }
}
