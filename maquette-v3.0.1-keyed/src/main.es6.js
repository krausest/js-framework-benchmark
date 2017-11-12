import {h, createProjector} from '../node_modules/maquette/dist/maquette.cjs.js';
import {Store} from './store.es6';

let projector = createProjector({});

const store = new Store();
const app = App();

projector.append(document.body, app.render);

function App() {
	const jumbo = Jumbotron();
	const table = Table();

	return {
		render: () =>
			h("div#main", [
				h("div.container", [
					jumbo.render(),
					table.render(),
					h("span.preloadicon.glyphicon.glyphicon-remove", {"aria-hidden": ""})
				])
			])
	};
}

function Jumbotron() {
	let exec = name => e => {
		store[name]();
	};

	let run			= exec("run");
	let runLots		= exec("runLots");
	let add			= exec("add");
	let update		= exec("update");
	let clear		= exec("clear");
	let swapRows	= exec("swapRows");

	return {
		render: () =>
			h("div.jumbotron", [
				h("div.row", [
					h("div.col-md-6", [
						h("h1", ["maquette v3.0.1 (keyed)"])
					]),
					h("div.col-md-6", [
						h("div.row", [
							h("div.col-sm-6.smallpad", [
								h("button.btn.btn-primary.btn-block#run", {type: "button", onclick: run}, ["Create 1,000 rows"])
							]),
							h("div.col-sm-6.smallpad", [
								h("button.btn.btn-primary.btn-block#runlots", {type: "button", onclick: runLots}, ["Create 10,000 rows"])
							]),
							h("div.col-sm-6.smallpad", [
								h("button.btn.btn-primary.btn-block#add", {type: "button", onclick: add}, ["Append 1,000 rows"])
							]),
							h("div.col-sm-6.smallpad", [
								h("button.btn.btn-primary.btn-block#update", {type: "button", onclick: update}, ["Update every 10th row"])
							]),
							h("div.col-sm-6.smallpad", [
								h("button.btn.btn-primary.btn-block#clear", {type: "button", onclick: clear}, ["Clear"])
							]),
							h("div.col-sm-6.smallpad", [
								h("button.btn.btn-primary.btn-block#swaprows", {type: "button", onclick: swapRows}, ["Swap Rows"])
							])
						])
					])
				])
			])
	};
}

function Table() {
	// delegated handler
	function tableClick(e) {
		var node = e.target;

		if (node.matches(".remove, .remove *")) {
			while (node.nodeName != "TR")
				node = node.parentNode;
			store.delete(+node.firstChild.textContent);
			e.stopPropagation();
		}
		else if (node.matches(".lbl")) {
			while (node.nodeName != "TR")
				node = node.parentNode;
			store.select(+node.firstChild.textContent);
			e.stopPropagation();
		}
	}

	return {
		render: () =>
			h("table.table.table-hover.table-striped.test-data", {onclick: tableClick}, [
				h("tbody", store.data.map(item =>
					h("tr" + (item.id === store.selected ? '.danger' : ''), {key: item.id}, [
						h("td.col-md-1", [""+item.id]),
						h("td.col-md-4", [
							h("a.lbl", [item.label])
						]),
						h("td.col-md-1", [
							h("a.remove", [
								h("span.glyphicon.glyphicon-remove", {"aria-hidden": ""})
							])
						]),
						h("td.col-md-6")
					])
				))
			])
	};
}