"use strict";

function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let nextId = 1;

function buildData(count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: nextId++,
            label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
        });
    }
    return data;
}

wildflower.component('benchmark-app', {
    state: {
        rows: [],
        selectedId: null
    },

    run() {
        this.state.rows = buildData(1000);
        this.state.selectedId = null;
    },

    runLots() {
        this.state.rows = buildData(10000);
        this.state.selectedId = null;
    },

    add() {
        this.state.rows.push(...buildData(1000));
    },

    update() {
        for (let i = 0; i < this.state.rows.length; i += 10) {
            this.state.rows[i].label += ' !!!';
        }
    },

    clear() {
        this.state.rows = [];
        this.state.selectedId = null;
    },

    swapRows() {
        const rows = this.state.rows;
        if (rows.length > 998) {
            const temp = rows[1];
            rows[1] = rows[998];
            rows[998] = temp;
        }
    },

    select(event, element, { item }) {
        this.state.selectedId = item.id;
    },

    remove(event, element, { item, index }) {
        this.state.rows.splice(index, 1);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    wildflower.scan();
});
