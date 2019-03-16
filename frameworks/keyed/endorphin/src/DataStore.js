import { Store } from '@endorphinjs/template-runtime';

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function random(max) {
    return Math.floor(Math.random() * 1000) % max;
}

export default class DataStore extends Store {
    constructor() {
        super();
        this.set({ rows: [], selected: null, id: 1 });
    }

    buildData(count = 1000) {
        const result = [];
        let { id } = this.get();

        for (let i = 0; i < count; i++) {
            result.push({
                id: id++,
                label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`
            });
        }

        this.set({ id });

        return result;
    }

    select(id) {
        this.set({ selected: id });
    }

    update() {
        const { rows, nextRows = rows.slice(0) } = this.get();

        for (let i = 0; i < rows.length; i += 10) {
            nextRows[i].label += ' !!!';
        }

        this.set({ rows: nextRows });
    }

    delete(id) {
        const { rows, idx = rows.findIndex(d => d.id == id) } = this.get();
        const nextRows = rows.slice(0, idx).concat(rows.slice(idx + 1));

        this.set({ rows: nextRows });
    }

    run() {
        this.set({ rows: this.buildData(), selected: null });
    }

    add() {
        const { rows } = this.get();

        this.set({ rows: rows.concat(this.buildData(1000)) });
    }

    runLots() {
        this.set({ rows: this.buildData(10000), selected: null });
    }

    clear() {
        this.set({ rows: [], selected: null });
    }

    swapRows() {
        const { rows, nextRows = rows.slice(0) } = this.get();

        if (rows.length > 998) {
            [nextRows[1], nextRows[998]] = [nextRows[998], nextRows[1]];

            this.set({ rows: nextRows });
        }
    }
}
