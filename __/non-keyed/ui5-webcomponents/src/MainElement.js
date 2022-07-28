import UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import litRender from "@ui5/webcomponents-base/dist/renderer/LitRenderer.js";
import Store from "./Store.js";

// Template
import MainElementTemplate from "./generated/templates/MainElementTemplate.lit.js";

const metadata = {
	tag: "main-element",
	properties: {
		_rows: {
			"type": Object,
			"multiple": true,
		},
		_selected: {
			"type": String,
		},
	},
	slots: {
	},
	events: {
	},
};

class MainElement extends UI5Element {
	constructor() {
		super();
		this.store = new Store();
	}

	static get metadata() {
		return metadata;
	}

	static get render() {
		return litRender;
	}

	static get template() {
		return MainElementTemplate;
	}

	onBeforeRendering() {
		this._rows.forEach(row => {
			row._class = this._selected === `${row.id}` ? "danger" : "";
		});
	}

	run() {
		this.store.run();
		this._rows = this.store.data;
		this._selected = this.store.selected;
	}

	runLots() {
		this.store.runLots();
		this._rows = this.store.data;
		this._selected = this.store.selected;
	}

	add() {
		this.store.add();
		this._rows = this.store.data;
		this._selected = this.store.selected;
	}

	update() {
		this.store.update();
		this._rows = this.store.data;
		this._selected = this.store.selected;
	}

	clear() {
		this.store.clear();
		this._rows = this.store.data;
		this._selected = this.store.selected;
	}

	swapRows() {
		this.store.swapRows();
		this._rows = this.store.data;
		this._selected = this.store.selected;
	}

	handleClick(e) {
		const { action, id } = e.target.dataset;
		if (action && id) {
			this[action](id);
		}
	}

	select(id) {
		this.store.select(id);
		this._rows = this.store.data;
		this._selected = this.store.selected;
	}

	remove(id) {
		this.store.delete(id);
		this._rows = this.store.data;
		this._selected = this.store.selected;
	}
}

MainElement.define();

export default MainElement;
