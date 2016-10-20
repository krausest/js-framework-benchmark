'use strict';

var startTime;
var lastMeasure;
var startMeasure = function(name) {
	startTime = performance.now();
	lastMeasure = name;
}
var stopMeasure = function() {
	var last = lastMeasure;
	if (lastMeasure) {
		window.setTimeout(function () {
			lastMeasure = null;
			var stop = performance.now();
			var duration = 0;
			console.log(last+" took "+(stop-startTime));
		}, 0);
	}
}

function _random(max) {
	return Math.round(Math.random()*1000)%max;
}

function Store() {
	this.data = [];
	this.backup = null;
	this.selected = null;
	this.id = 1;
}

Store.prototype = {
	constructor: Store,

	buildData: function(count) {
		count = count || 1000;

		var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
		var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
		var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
		var data = [];
		for (var i = 0; i < count; i++)
			data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
		return data;
	},

	updateData: function(mod) {
		mod = mod || 10;

		for (let i=0;i<this.data.length;i+=10) {
			this.data[i].label += ' !!!';
		//	this.data[i] = Object.assign({}, this.data[i], {label: this.data[i].label +' !!!'});
		}
	},

	delete: function(id) {
		const idx = this.data.findIndex(d => d.id==id);
		this.data = this.data.filter((e,i) => i!=idx);
		return this;
	},

	run: function() {
		this.data = this.buildData();
		this.selected = null;
	},

	add: function() {
		this.data = this.data.concat(this.buildData(1000));
		this.selected = null;
	},

	update: function() {
		this.updateData();
		this.selected = null;
	},

	select: function(id) {
		this.selected = id;
	},

	hideAll: function() {
		this.backup = this.data;
		this.data = [];
		this.selected = null;
	},

	showAll: function() {
		this.data = this.backup;
		this.backup = null;
		this.selected = null;
	},

	runLots: function() {
		this.data = this.buildData(10000);
		this.selected = null;
	},

	clear: function() {
		this.data = [];
		this.selected = null;
	},

	swapRows: function() {
		if(this.data.length > 10) {
			var a = this.data[4];
			this.data[4] = this.data[9];
			this.data[9] = a;
		}
	},
};


var el = domvm.defineElement;

let wrapMeasure = (store, name) => e => {
	startMeasure(name);
	store[name]();
	vm.redraw();
	stopMeasure(name);
};

let store = new Store();

let vm = domvm.createView(View, store).mount(document.body);

function View(vm, store) {
	let run			= wrapMeasure(store, "run");
	let runLots		= wrapMeasure(store, "runLots");
	let add			= wrapMeasure(store, "add");
	let update		= wrapMeasure(store, "update");
	let clear		= wrapMeasure(store, "clear");
	let swapRows	= wrapMeasure(store, "swapRows");

	let select = (e, node) => {
		startMeasure("select");
		store.select(node.data);
		vm.redraw();
		stopMeasure("select");
		return false;
	};

	let remove = (e, node) => {
		startMeasure("delete");
		store.delete(node.data == null ? node.parent.data : node.data);
		vm.redraw();
		stopMeasure("delete");
		return false;
	};

	// delegated handler
	let tableClick = {
		".remove, .remove *": remove,
		".lbl": select,
	};

	return _ =>
	el("#main", [
		el(".container", [
			el(".jumbotron", [
				el(".row", [
					el(".col-md-6", [
						el("h1", "domvm v2.0-dev")
					]),
					el(".col-md-6", [
						el(".row", [
							el(".col-sm-6.smallpad", [
								el("button.btn.btn-primary.btn-block#run", {type: "button", onclick: run}, "Create 1,000 rows")
							]),
							el(".col-sm-6.smallpad", [
								el("button.btn.btn-primary.btn-block#runlots", {type: "button", onclick: runLots}, "Create 10,000 rows")
							]),
							el(".col-sm-6.smallpad", [
								el("button.btn.btn-primary.btn-block#add", {type: "button", onclick: add}, "Append 1,000 rows")
							]),
							el(".col-sm-6.smallpad", [
								el("button.btn.btn-primary.btn-block#update", {type: "button", onclick: update}, "Update every 10th row")
							]),
							el(".col-sm-6.smallpad", [
								el("button.btn.btn-primary.btn-block#clear", {type: "button", onclick: clear}, "Clear")
							]),
							el(".col-sm-6.smallpad", [
								el("button.btn.btn-primary.btn-block#swaprows", {type: "button", onclick: swapRows}, "Swap Rows")
							])
						])
					])
				])
			]),
			el("table.table.table-hover.table-striped.test-data", {onclick: tableClick}, [
				el("tbody", store.data.map(item =>
					el("tr", {class: item.id === store.selected ? 'danger' : null}, [
						el("td.col-md-1", item.id),
						el("td.col-md-4", [
							el("a.lbl", {_data: item.id}, item.label)
						]),
						el("td.col-md-1", [
							el("a.remove", {_data: item.id}, [
								el("span.glyphicon.glyphicon-remove", {"aria-hidden": true})
							])
						]),
						el("td.col-md-6")
					])
				))
			]),
			el("span.preloadicon.glyphicon.glyphicon-remove", {"aria-hidden": true})
		])
	])
}