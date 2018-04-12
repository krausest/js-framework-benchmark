function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

export class Store {
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
            data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    }
    updateData(mod = 10) {
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += ' !!!';
        }
    }
    delete(id) {
        const idx = this.data.findIndex(d => d.id==id);
        this.data.splice(idx, 1);
    }
    run() {
        // faster: 178 msecs
        // this.data = []
        // setTimeout(() => {this.data = this.buildData();});
        // slower: 194 msecs
        this.data.splice(0, this.data.length, ...this.buildData());
    }
    add() {
        this.data = this.data.concat(this.buildData(1000));
        this.selected = undefined;
    }
    update() {
        this.updateData();
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
        if (this.data.length > 998) {
            var temp = this.data[1];            
            var temp2 = this.data[998];  
            this.data.splice(1, 1, temp2);
            this.data.splice(998, 1, temp);
        }
    }

}
