import {StoreObject, GenericObjectStore} from "Store";
import {State} from "State";

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

class RowStateObject extends StoreObject {

    setSelected() {
        this.getStore().select(this.id);
    }

    delete() {
        this.getStore().delete(this.id);
    }
}


export class RowStore extends GenericObjectStore {
    constructor(state) {
        super("rows", RowStateObject, {state: state});
        this.selected = undefined;
        this.id = 1;
	}

    generateData(count) {
        const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        let data = [];
        for (let i = 0; i < count; i++)
            data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    }

    addData(count) {
        this.getState().importState({"rows": this.generateData(count)});
    }

    clearData() {
        this.all().reverse().map((obj) => {
            this.applyDeleteEvent(obj);
        });
        this.selected = undefined;
    }

    rebuildData(count) {
        this.clearData();
        this.addData(count);
    }

    updateData(mod) {
        const arr = this.all();
        for (let i = 0; i < arr.length; i += mod) {
            const obj = arr[i];
            this.applyUpdateOrCreateEvent({id: obj.id, data: {label: obj.label + ' !!!'}});
        }
    }

    delete(id) {
        this.applyDeleteEvent({id: id});
    }

    run() {
        this.rebuildData(1000);
        this.selected = undefined;
    }

    add() {
        this.addData(1000);
    }

    update() {
        this.updateData(10);
    }

    select(id) {
        const oldSelected = this.selected;
        this.selected = id;
        this.applyUpdateOrCreateEvent({id: this.selected});
        if (oldSelected)
            this.applyUpdateOrCreateEvent({id: oldSelected});
    }

    runLots() {
        this.rebuildData(10000);
        this.selected = undefined;
    }

    clear() {
        this.clearData();
    }
}
