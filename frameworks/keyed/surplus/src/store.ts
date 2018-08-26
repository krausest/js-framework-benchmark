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

export type Store = ReturnType<typeof Store>;
export const Store = () => {
    const data = S.data<Row[]>([]),
        selected = S.value<number | undefined>(undefined),
        updateData = (mod = 10) => {
            let _data = data();
            S.freeze(() => {
                for (let i = 0; i < _data.length; i += 10) {
                    _data[i].label(_data[i].label() + " !!!");
                }
            });
        };

    return {
        data,
        selected,
        
        delete(id: number) {
            const _data = data(),
                idx = _data.findIndex(d => d.id === id);
            _data.splice(idx, 1);
            data(_data);
        },
        run() {
            S.freeze(() => {
                data(buildData(1000));
                selected(undefined);
            });
        },
        add() {
            data(data().concat(buildData(1000)));
        },
        update() {
            updateData();
        },
        select(id: number) {
            selected(id);
        },
        runLots() {
            S.freeze(() => {
                data(buildData(10000));
                selected(undefined);
            });
        },
        clear() {
            S.freeze(() => {
                data([]);
                selected(undefined);
            });
        },
        swapRows() {
            let _data = data();
            if (_data.length > 998) {
                var a = _data[1];
                _data[1] = _data[998];
                _data[998] = a;
            }
            data(_data);
        }
    };
}
