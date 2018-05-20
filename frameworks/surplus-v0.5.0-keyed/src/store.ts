import S, { DataSignal } from "s-js";

function random(max: number) {
    return Math.round(Math.random() * 1000) % max;
}

var rowId = 1;
var adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy"
];
var colours = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange"
];
var nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard"
];

function buildData(count: number) {
    var data: Row[] = new Array(count);
    for (var i = 0; i < count; i++) {
        data[i] = new Row(
            rowId++,
            adjectives[random(adjectives.length)] +
                " " +
                colours[random(colours.length)] +
                " " +
                nouns[random(nouns.length)]
        );
    }
    return data;
}

export class Row {
    label: DataSignal<string>;
    constructor(public id: number, label: string) {
        this.label = S.data(label);
    }
}

export class Store {
    data = S.data<Row[]>([]);
    selected = S.value<number | undefined>(undefined);

    updateData(mod = 10) {
        let data = this.data();
        S.freeze(() => {
            for (let i = 0; i < data.length; i += 10) {
                data[i].label(data[i].label() + " !!!");
            }
        });
    }
    delete(id: number) {
        const data = this.data().slice(0),
            idx = (data as any).findIndex((d: Row) => d.id == id);
        data.splice(idx, 1);
        this.data(data);
    }
    run() {
        S.freeze(() => {
            this.data(buildData(1000));
            this.selected(undefined);
        });
    }
    add() {
        this.data(this.data().concat(buildData(1000)));
    }
    update() {
        this.updateData();
    }
    select(id: number) {
        this.selected(id);
    }
    runLots() {
        S.freeze(() => {
            this.data(buildData(10000));
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
        if (data.length > 998) {
            var a = data[1];
            data[1] = data[998];
            data[998] = a;
        }
        this.data(data);
    }
}
