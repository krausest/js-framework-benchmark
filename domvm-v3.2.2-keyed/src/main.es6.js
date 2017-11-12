import domvm from '../node_modules/domvm/dist/nano/domvm.nano.min.js';
import {Store} from './store.es6';

const h = (tag, arg1, arg2) => domvm.defineElement(tag, arg1, arg2, domvm.FIXED_BODY);
const v = domvm.defineView;
const store = new Store();

domvm.createView(App).mount(document.body);

function App(vm) {
	return _ =>
		h("#main", [
			h(".container", [
				v(Jumbotron),
				v(Table),
				h("span.preloadicon.glyphicon.glyphicon-remove", {"aria-hidden": ""})
			])
		]);
}

function Jumbotron(vm) {
	vm.config({diff: _ => 0});

	let exec = name => e => {
		store[name]();
		vm.root().redraw();
	};

	let run			= exec("run");
	let runLots		= exec("runLots");
	let add			= exec("add");
	let update		= exec("update");
	let clear		= exec("clear");
	let swapRows	= exec("swapRows");

	return _ =>
		h(".jumbotron", [
			h(".row", [
				h(".col-md-6", [
					h("h1", "domvm v3.2.2 (keyed)")
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
		]);
}

function Table(vm) {
	let select = (e, node) => {
		while (node.key == null)
			node = node.parent;
		store.select(node.key);
		vm.redraw();
		return false;
	};

	let remove = (e, node) => {
		while (node.key == null)
			node = node.parent;
		store.delete(node.key);
		vm.redraw();
		return false;
	};

	// delegated handler
	let tableClick = {
		".remove, .remove *": remove,
		".lbl": select,
	};

	return _ => {
		var items = domvm.lazyList(store.data, {
			key:  item => item.id,
			diff: item => [item.label, item.id === store.selected],
		});

		return h("table.table.table-hover.table-striped.test-data", {onclick: tableClick}, [
			h("tbody", {_flags: domvm.LAZY_LIST | domvm.KEYED_LIST}, items.map(item =>
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
		]);
	};
}