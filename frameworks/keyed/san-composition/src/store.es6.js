import san from 'san/dist/san.spa.modern.js';

'use strict';

function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}

export class Store {
    constructor() {
        this.data = [];
        this.selected = undefined;
        this.id = 1;
        this.ops = [];
        this.fires = [];
    }
    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({ id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    }
    updateData(mod = 10) {
        // Just assigning setting each tenth this.data doesn't cause a redraw, the following does:
        var newData = this.data.slice(0);
        for (let i = 0; i < this.data.length; i += mod) {
            newData[i] = Object.assign({}, this.data[i], { label: this.data[i].label + ' !!!' });
        }

        this.data = newData;

        this.ops.push(
            {
                type: 'set',
                name: 'rows',
                arg: this.data
            }
        );
    }
    delete(id) {
        const idx = this.data.findIndex(d => d.id == id);
        this.data = this.data.slice(0, idx).concat(this.data.slice(idx + 1))
        this.ops.push(
            {
                type: 'removeAt',
                name: 'rows',
                arg: idx
            }
        );
    }
    run() {
        this.data = this.buildData();
        this.selected = null;
        this.ops.push(
            {
                type: 'set',
                name: 'rows',
                arg: this.data
            }
        );
    }
    add() {
        var addData = this.buildData(1000);
        this.data = this.data.concat(addData);

        this.ops.push(
            {
                type: 'set',
                name: 'rows',
                arg: this.data
            }
        );
    }
    update() {
        this.updateData();
    }
    select(id) {
        var resetIndex;
        var selectedIndex;
        var oldId = this.selected;
        this.data.forEach(function (item, index) {
            if (item.id == oldId) {
                resetIndex = index;
            }

            if (item.id == id) {
                selectedIndex = index;
            }
        });

        this.selected = id;

        var newData = this.data.slice(0);

        if (resetIndex != null) {
            newData[resetIndex] = Object.assign({}, this.data[resetIndex], { selected: false });
        }

        if (selectedIndex != null) {
            newData[selectedIndex] = Object.assign({}, this.data[selectedIndex], { selected: true });
        }

        this.data = newData;
        this.ops.push(
            {
                type: 'set',
                name: 'rows',
                arg: this.data
            }
        );
    }
    runLots() {
        this.data = this.buildData(10000);
        this.selected = null;
        this.ops.push(
            {
                type: 'set',
                name: 'rows',
                arg: this.data
            }
        );
    }
    clear() {
        this.data = [];
        this.selected = null;
        this.ops.push(
            {
                type: 'set',
                name: 'rows',
                arg: this.data
            }
        );
    }
    swapRows() {
        if (this.data.length > 998) {
            var newData = this.data.slice(0);
            newData[1] = this.data[998];
            newData[998] = this.data[1];
            this.data = newData;

            this.ops.push(
                {
                    type: 'set',
                    name: 'rows',
                    arg: this.data
                }
            );
        }
    }
}
