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
        	newData[i] = this.data[i];
            if (i%10===0) {
                newData[i].label += ' !!!';
            }
        }
        this.data = newData;
    }

    delete(id) {
        let idx = this.data.findIndex(d => d.id == id);
        this.data.splice(idx, 1);
        this.data = this.data;
    }

    run() {
        this.data = this.buildData();
        this.selected = undefined;
    }

    add() {
        this.data = this.data.concat(this.buildData(1000));
        this.selected = undefined;
    }

    update() {
        this.updateData();
        this.selected = undefined;
    }

    select(id) {
        this.selected = id;
    }
    
    hideAll() {
    	this.backup = this.data;
        this.data = [];
        this.selected = undefined;
    }
    
    showAll() {
        this.data = this.backup;
        this.backup = null;
        this.selected = undefined;
    }
    
    runLots() {
        this.data = this.buildData(10000);
        this.selected = undefined;
    }
    
    clear() {
        this.data = [];
        this.selected = undefined;
    }
    
    swapRows() {
    	if(this.data.length > 10) {
    		let d4 = this.data[4];
			let d9 = this.data[9];
			
			var newData = this.data.map(function(data, i) {
				if(i === 4) {
					return d9;
				}
				else if(i === 9) {
					return d4;
				}
				return data;
			});
			this.data = newData;
    	}
    }
}

@inject(TaskQueue)
export class App {
    constructor(taskQueue) {
        this.store = new Store();
        this.taskQueue = taskQueue;
    }

    get rows() {
        return this.store.data;
    }
    get selected() {
        return this.store.selected;
    }

    run() {
        this.store.run();
    }
    add() {
        this.store.add();
    }
    remove(item) {
        this.store.delete(item.id);
    }
    select(item) {
        this.store.select(item.id);
    }
    update() {
        this.store.update();
    }
    
    hideAll() {
        this.store.hideAll();
    }
    
    showAll() {
        this.store.showAll();
    }
    
    runLots() {
        this.store.runLots();
    }
    
    clear() {
        this.store.clear();
    }
    
    swapRows() {
        this.store.swapRows();
    }
}
