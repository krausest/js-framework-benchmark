
export default class HomeController {
    $onInit() {
        this.start = 0;
        this.data = [];
        this.id = 1;
    }

    buildData(count = 1000) {
        const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        const data = [];
        for (let i = 0, len = count; i < len; i++) {
            data.push({ id: this.id++, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
        }
        return data;
    }
    _random(max) {
        return Math.round(Math.random() * 1000) % max;
    }
    add() {
        this.start = performance.now();
        this.data = this.data.concat(this.buildData(1000));
    }
    select(item) {
        this.start = performance.now();
        this.selected = item.id;
    }
    del(item) {
        this.start = performance.now();
        const idx = this.data.findIndex(d => d.id===item.id);
        this.data.splice(idx, 1);
    }
    update() {
        this.start = performance.now();
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += ' !!!';
        }
    }
    run() {
        this.start = performance.now();
        this.data = this.buildData();
    };
    runLots() {
        this.start = performance.now();
        this.data = this.buildData(10000);
        this.selected = null;
    };
    clear() {
        this.start = performance.now();
        this.data = [];
        this.selected = null;
    };
    swapRows() {
    	if(this.data.length > 998) {
    		var a = this.data[1];
    		this.data[1] = this.data[998];
    		this.data[998] = a;
    	}
    };
};