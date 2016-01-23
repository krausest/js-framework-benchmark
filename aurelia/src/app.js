import {inject, TaskQueue} from 'aurelia-framework';

function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}

class Store {
    constructor() {
        this.data = [];
        this.selected = undefined;
        this.id = 1;
    }

    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({
                id: this.id++,
                label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
            });
        return data;
    }

    updateData(mod = 10) {
        // Just assigning setting each tenth this.data doesn't cause a redraw, the following does:
        var newData = [];
        for (let i = 0; i < this.data.length; i ++) {
            if (i%10===0) {
                newData[i] = Object.assign({}, this.data[i], {label: this.data[i].label + '.'});
            } else {
                newData[i] = this.data[i];
            }
        }
        this.data = newData;
    }

    delete(id) {
        const idx = this.data.findIndex(d => d.id == id);
        this.data = this.data.filter((e, i) => i != idx);
        return this;
    }

    run() {
        this.data = this.buildData();
        this.selected = undefined;
    }

    add() {
        this.data = this.data.concat(this.buildData(10));
        this.selected = undefined;
    }

    update() {
        this.updateData();
        this.selected = undefined;
    }

    select(id) {
        this.selected = id;
    }
}

@inject(TaskQueue)
export class App {
    constructor(taskQueue) {
        this.store = new Store();
        this.taskQueue = taskQueue;
        console.log("store", this.store, taskQueue);
    }

    get rows() {
        return this.store.data;
    }
    get selected() {
        return this.store.selected;
    }

    run() {
        console.log("run");
        this.store.run();
    }
    add() {
        console.log("add");
        this.store.add();
    }
    remove(item) {
        console.log("remove", item);
        this.store.delete(item.id);
    }
    select(item) {
        console.log("select",item);
        this.store.select(item.id);
    }
    update() {
        console.log("update");
        this.store.update();
    }
}
