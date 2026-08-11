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

wildflower.component('benchmark-pool-app', {
    state: {},

    pools: {
        rows: {
            props: { selectedId: null }
        }
    },

    run() {
        const pool = this.pools.rows;
        pool.clear();
        pool.push(buildData(1000));
        pool.props.selectedId = null;
    },

    runLots() {
        const pool = this.pools.rows;
        pool.clear();
        pool.push(buildData(10000));
        pool.props.selectedId = null;
    },

    add() {
        this.pools.rows.push(buildData(1000));
    },

    update() {
        const pool = this.pools.rows;
        for (let i = 0; i < pool.length; i += 10) {
            const item = pool.at(i);
            item.label += ' !!!';
            pool.markDirty(item.id);
        }
    },

    clear() {
        const pool = this.pools.rows;
        pool.clear();
        pool.props.selectedId = null;
    },

    swapRows() {
        const pool = this.pools.rows;
        if (pool.length > 998) {
            const key1 = pool.at(1).id;
            const key2 = pool.at(998).id;
            pool.swap(key1, key2);
            pool.markDirty(key1);
            pool.markDirty(key2);
        }
    },

    select(item) {
        const pool = this.pools.rows;
        const prevId = pool.props.selectedId;
        pool.props.selectedId = item.id;
        if (prevId != null) pool.markDirty(prevId);
        pool.markDirty(item.id);
    },

    remove(item) {
        this.pools.rows.remove(item.id);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    wildflower.scan();
});
