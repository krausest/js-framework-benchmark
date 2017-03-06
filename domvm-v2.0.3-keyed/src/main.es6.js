import domvm from '../node_modules/domvm/dist/nano/domvm.nano.min.js';

import {Store} from './store.es6';

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

var h  = (tag, arg1, arg2) => domvm.defineElement(tag, arg1, arg2, domvm.FIXED_BODY);

let store = new Store();

let vm = domvm.createView(View, store).mount(document.body);

function View(vm, store) {
	let wrapMeasure = name => e => {
		startMeasure(name);
		store[name]();
		vm.redraw(true);
		stopMeasure(name);
	};

	let run			= wrapMeasure("run");
	let runLots		= wrapMeasure("runLots");
	let add			= wrapMeasure("add");
	let update		= wrapMeasure("update");
	let clear		= wrapMeasure("clear");
	let swapRows	= wrapMeasure("swapRows");

	let select = (e, node) => {
		startMeasure("select");
		while (node.key == null)
			node = node.parent;
		store.select(node.key);
		vm.redraw(true);		// sync redraw
		stopMeasure("select");
		return false;
	};

	let remove = (e, node) => {
		startMeasure("delete");
		while (node.key == null)
			node = node.parent;
		store.delete(node.key);
		vm.redraw(true);
		stopMeasure("delete");
		return false;
	};

	// delegated handler
	let tableClick = {
		".remove, .remove *": remove,
		".lbl": select,
	};

	return _ =>
	h("#main", [
		h(".container", [
			h(".jumbotron", [
				h(".row", [
					h(".col-md-6", [
						h("h1", "domvm v2.0.3 (keyed)")
					]),
					h(".col-md-6", [
						h(".row", [
							h(".col-sm-6.smallpad", [
								h("button.btn.btn-primary.btn-block#run", {type: "button", onclick: run}, "Create 1,000 rows")
							]),
							h(".col-sm-6.smallpad", [
								h("button.btn.btn-primary.btn-block#runlots", {type: "button", onclick: runLots}, "Create 10,000 rows")
							]),
							h(".col-sm-6.smallpad", [
								h("button.btn.btn-primary.btn-block#add", {type: "button", onclick: add}, "Append 1,000 rows")
							]),
							h(".col-sm-6.smallpad", [
								h("button.btn.btn-primary.btn-block#update", {type: "button", onclick: update}, "Update every 10th row")
							]),
							h(".col-sm-6.smallpad", [
								h("button.btn.btn-primary.btn-block#clear", {type: "button", onclick: clear}, "Clear")
							]),
							h(".col-sm-6.smallpad", [
								h("button.btn.btn-primary.btn-block#swaprows", {type: "button", onclick: swapRows}, "Swap Rows")
							])
						])
					])
				])
			]),
			h("table.table.table-hover.table-striped.test-data", {onclick: tableClick}, [
				h("tbody", {_flags: domvm.KEYED_LIST}, store.data.map(item =>
					h("tr", {_key: item.id, class: item.id === store.selected ? 'danger' : null}, [
						h("td.col-md-1", item.id),
						h("td.col-md-4", [
							h("a.lbl", item.label)
						]),
						h("td.col-md-1", [
							h("a.remove", [
								h("span.glyphicon.glyphicon-remove", {"aria-hidden": ""})
							])
						]),
						h("td.col-md-6")
					])
				))
			]),
			h("span.preloadicon.glyphicon.glyphicon-remove", {"aria-hidden": ""})
		])
	])
}