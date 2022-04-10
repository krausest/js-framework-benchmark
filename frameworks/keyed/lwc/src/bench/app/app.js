import { LightningElement, track } from 'lwc';

let id = 1;

function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}

export default class App extends LightningElement {
    static renderMode = 'light';
    @track rows = [];
    selected;

    run() {
        this.rows = this.buildData();
        this.selected = undefined;
    }
    runLots() {
        this.rows = this.buildData(10000);
        this.selected = undefined;
    }
    delete(id) {
        const idx = this.rows.findIndex(row => row.id === id);
        this.rows.splice(idx, 1);
    }
    add() {
        this.rows.push(...this.buildData(1000));
    }
    update() {
        for (let i = 0, len = this.rows.length; i < len; i += 10) {
            this.rows[i].label += ' !!!';
        }
    }
    select(id) {
        this.selected = id;
    }
    clear() {
        this.rows.length = 0;
        this.selected = undefined;
    }
    swapRows() {
        if (this.rows.length > 998) {
            const row = this.rows[1];
            this.rows[1] = this.rows[998];
            this.rows[998] = row;
        }
    }
    handleRowClick(evt) {
        const { target } = evt;
        const { interaction, id } = target.dataset;

        if (interaction === 'select') {
            this.select(parseInt(id, 10));
        } else if (interaction === 'remove') {
            this.delete(parseInt(id, 10));
        }
    }
    buildData(count = 1000) {
        const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        const data = [];
        const component = this;
        for (let i = 0; i < count; i++) {
            data.push({
                id: id++,
                label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)],
                get className() {
                    return this.id === component.selected ? 'danger' : '';
                }
            });
        }
        return data;
    }
}
