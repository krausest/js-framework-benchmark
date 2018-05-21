import {
	createView,
	defineElement,
	defineView,
	FIXED_BODY,
	KEYED_LIST,
	LAZY_LIST,
	lazyList
} from '../node_modules/domvm/dist/nano/domvm.nano.es.js';

import { Store } from './store.es6';

// el for static dom structures
const el = (tag, arg1, arg2) => defineElement(tag, arg1, arg2, FIXED_BODY);

const store = new Store();

// for hygenic event handlers
store.exec   = name => store[name]();
store.select = store.select.bind(store);
store.delete = store.delete.bind(store);

createView(AppView, store).mount(document.body);

function AppView(vm, store) {
	// auto-redraw
	vm.config({
		onevent: function() {
			vm.redraw();
			return false;
		}
	});

	return _ =>
		el("#main", [
			el(".container", [
				JumbotronTpl(store),
				TableTpl(store),
				el("span.preloadicon.glyphicon.glyphicon-remove", {"aria-hidden": ""})
			])
		]);
}

function JumbotronTpl(store) {
	return (
		el(".jumbotron", [
			el(".row", [
				el(".col-md-6", [
					el("h1", "domvm (keyed)")
				]),
				el(".col-md-6", [
					el(".row", [
						ButtonTpl(store, "run",      "Create 1,000 rows"),
						ButtonTpl(store, "runLots",  "Create 10,000 rows"),
						ButtonTpl(store, "add",      "Append 1,000 rows"),
						ButtonTpl(store, "update",   "Update every 10th row"),
						ButtonTpl(store, "clear",    "Clear"),
						ButtonTpl(store, "swapRows", "Swap Rows"),
					])
				])
			])
		])
	);
}

function ButtonTpl(store, action, text) {
	return (
		el(".col-sm-6.smallpad", [
			el("button.btn.btn-primary.btn-block#" + action.toLowerCase(), {
				type: "button",
				onclick: [store.exec, action],
			}, text)
		])
	);
}

function TableTpl(store) {
	const items = lazyList(store.data, {
		key:  item => item.id,
		diff: item => [item.label, item.id === store.selected],
	});

	return (
		el("table.table.table-hover.table-striped.test-data", [
			el("tbody", {_flags: LAZY_LIST | KEYED_LIST}, items.map(item =>
				RowTpl(item, store)
			))
		])
	);
}

function RowTpl(item, store) {
	return (
		el("tr", {_key: item.id, class: item.id === store.selected ? 'danger' : null}, [
			el("td.col-md-1", item.id),
			el("td.col-md-4", [
				el("a", {onclick: [store.select, item.id]}, item.label)
			]),
			el("td.col-md-1", [
				el("a", {onclick: [store.delete, item.id]}, [
					el("span.glyphicon.glyphicon-remove", {"aria-hidden": ""})
				])
			]),
			el("td.col-md-6")
		])
	);
}