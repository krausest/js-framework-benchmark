import san from 'san/dist/san.spa.modern.js';

'use strict';

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

export class Store {
    constructor() {
        this.data = [];
        this.selected = undefined;
        this.id = 1;
        this.ops = [];
    }
    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    }
    updateData(mod = 10) {
        // Just assigning setting each tenth this.data doesn't cause a redraw, the following does:
        var newData = this.data.slice(0);
        var expr = san.parseExpr('rows[0].label');
        for (let i = 0; i < this.data.length; i += mod) {
            let newRow = Object.assign({}, this.data[i], {label: this.data[i].label + ' !!!'});
            newData[i] = newRow;
            this.ops.push({
                type: 'set',
                name: {
                    type: expr.type,
                    paths: [
                        expr.paths[0], 
                        {type: expr.paths[1].type, value: i}, 
                        expr.paths[2]
                    ],
                    raw: 'rows[' + i + '].label'
                },
                arg: newRow.label
            });
        }

        this.data = newData;
    }
    delete(id) {
        const idx = this.data.findIndex(d => d.id==id);
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
                name: 'selected',
                arg: null
            },
            {
                type: 'set',
                name: 'rows',
                arg: this.data
            }
        );
    }
    add() {
        var addData = this.buildData(1000);
        var len = this.data.length;
        this.data = this.data.concat(addData);

        this.ops.push({
            type: 'splice',
            name: 'rows',
            arg: [len, 0].concat(addData)
        });
    }
    update() {
        this.updateData();
    }
    select(id) {
        this.selected = id;
        this.ops.push({
            type: 'set',
            name: 'selected',
            arg: id
        });
    }
    runLots() {
        this.data = this.buildData(10000);
        this.selected = null;
        this.ops.push(
            {
                type: 'set',
                name: 'selected',
                arg: null
            },
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
            },
            {
                type: 'set',
                name: 'selected',
                arg: null
            }
        );
    }
    swapRows() {
        if(this.data.length > 998) {
            let d1 = this.data[1];
            let d998 = this.data[998];

            var newData = this.data.map(function(data, i) {
                if(i === 1) {
                    return d998;
                }
                else if(i === 998) {
                    return d1;
                }
                return data;
            });
            this.data = newData;
            this.ops.push(
                {
                    type: 'splice',
                    name: 'rows',
                    arg: [998, 1, d1]
                },
                {
                    type: 'splice',
                    name: 'rows',
                    arg: [1, 1, d998]
                }
            );
        }
    }
}
