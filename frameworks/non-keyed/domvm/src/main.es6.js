import {
	createView,
	defineElement,
	FIXED_BODY,
	list,
} from '../node_modules/domvm/dist/pico/domvm.pico.es.js';

import { Store } from './store.es6';

// el for static dom structures
const el = (tag, arg1, arg2) => defineElement(tag, arg1, arg2, FIXED_BODY);

const store = new Store();

// for hygenic event handlers
store.exec = (name, id) => {
	store[name](id);
	vm.redraw();
};

const vm = createView(AppView, store).mount(document.body);

function AppView(vm, store) {
	return _ => (
		el("div", {id: "main"}, [
			el("div", {class: "container"}, [
				JumbotronTpl(store),
				TableTpl(store),
				el("span", {class: "preloadicon glyphicon glyphicon-remove", "aria-hidden": "true"})
			])
		])
	);
}

function JumbotronTpl(store) {
	return (
		el("div", {class: "jumbotron"}, [
			el("div", {class: "row"}, [
				el("div", {class: "col-md-6"}, [
					el("h1", "domvm (non-keyed)")
				]),
				el("div", {class: "col-md-6"}, [
					el("div", {class: "row"}, [
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
		el("div", {class: "col-sm-6 smallpad"}, [
			el("button", {
				class: "btn btn-primary btn-block",
				id: action.toLowerCase(),
				type: "button",
				onclick: [store.exec, action],
			}, text)
		])
	);
}

function TableTpl(store) {
	const diff = {
		val: (item) => item.label + (item.id === store.selected),
		eq: (o, n) => o === n,
	};

	return (
		el("table", {class: "table table-hover table-striped test-data"}, [
			el("tbody", list(store.data, diff).map(item =>
				RowTpl(item, store)
			))
		])
	);
}

function RowTpl(item, store) {
	return (
		el("tr", {class: item.id === store.selected ? 'danger' : null}, [
			el("td", {class: "col-md-1"}, item.id),
			el("td", {class: "col-md-4"}, [
				el("a", {onclick: [store.exec, "select", item.id]}, item.label)
			]),
			el("td", {class: "col-md-1"}, [
				el("a", {onclick: [store.exec, "delete", item.id]}, [
					el("span", {class: "glyphicon glyphicon-remove", "aria-hidden": "true"})
				])
			]),
			el("td", {class: "col-md-6"})
		])
	);
}