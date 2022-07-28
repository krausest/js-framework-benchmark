function _random(max) {
	return Math.round(Math.random() * 1000) % max;
}

class Store {
	constructor() {
		this.data = [];
		this.backup = null;
		this.selected = null;
		this.id = 1;
	}

	buildData(count = 1000) {
		const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
		const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
		const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
		const data = [];
		for (let i = 0; i < count; i++) { data.push({ id: this.id++, label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}` }); }
		return data;
	}

	updateData(mod = 10) {
		for (let i = 0; i < this.data.length; i += 10) {
			this.data[i].label += " !!!";
		}
	}

	delete(id) {
		const idx = this.data.findIndex(d => `${d.id}` === id);
		this.data.splice(idx, 1);
	}

	run() {
		this.data = this.buildData();
		this.selected = null;
	}

	add() {
		this.data = this.data.concat(this.buildData(1000));
		this.selected = null;
	}

	update() {
		this.updateData();
		this.selected = null;
	}

	select(id) {
		this.selected = id;
	}

	hideAll() {
		this.backup = this.data;
		this.data = [];
		this.selected = null;
	}

	showAll() {
		this.data = this.backup;
		this.backup = null;
		this.selected = null;
	}

	runLots() {
		this.data = this.buildData(10000);
		this.selected = null;
	}

	clear() {
		this.data = [];
		this.selected = null;
	}

	swapRows() {
		if (this.data.length > 998) {
			const a = this.data[1];
			this.data[1] = this.data[998];
			this.data[998] = a;
		}
	}
}

export default Store;
