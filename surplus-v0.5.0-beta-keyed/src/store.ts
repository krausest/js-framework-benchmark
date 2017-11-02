import S, { DataSignal } from 's-js';

function _random(max : number) {
    return Math.round(Math.random()*1000)%max;
}

export class Row {
    label : DataSignal<string>;
    constructor (public id : number, label : string) {
        this.label = S.data(label);
    }
}

export class Store {
    data = S.data<Row[]>([]);
    selected = S.value<number | undefined>(undefined);
    id = 1;

    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data : Row[] = [];
        for (var i = 0; i < count; i++)
            data.push(new Row(this.id++, adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]));
        return data;
    }
    updateData(mod = 10) {
        let data = this.data();
        S.freeze(() => {
            for (let i = 0; i < data.length; i += 10) {
                data[i].label(data[i].label() + ' !!!');
            }   
        });
    }
    delete(id : number) {
        const data = this.data().slice(0),
            idx = (data as any).findIndex((d : Row) => d.id == id);
        data.splice(idx, 1);
        this.data(data);
    }
    run() {
        this.data([]);
        S.freeze(() => {
            this.data(this.buildData());
            this.selected(undefined);
        });
    }
    add() {
        this.data(this.data().concat(this.buildData(1000)));
    }
    update() {
        this.updateData();
    }
    select(id : number) {
        this.selected(id);
    }
    runLots() {
        this.data([]);
        S.freeze(() => {
            this.data(this.buildData(10000));
            this.selected(undefined);
        });
    }
    clear() {
        S.freeze(() => {
            this.data([]);
            this.selected(undefined);
        });
    }
    swapRows() {
        let data = this.data();
    	if(data.length > 10) {
    		var a = data[4];
    		data[4] = data[9];
    		data[9] = a;
    	}
        this.data(data);
    }
}