import {Solarite, h} from './Solarite.min.js';
//import {Solarite, h} from '../../src/Solarite.js';
let debug = window.location.search.includes('debug');


let urlParams = new URLSearchParams(window.location.search);
let benchmark = urlParams.get('benchmark');
if (benchmark === '')
	benchmark = 1;
let run = urlParams.has('run');

if (debug) {
	window.getHtml = (item, includeComments=false) => {
		if (!item)
			return item;

		if (item.fragment)
			item = item.fragment; // Shell
		if (item instanceof DocumentFragment)
			item = [...item.childNodes]

		else if (item.getNodes)
			item = item.getNodes()

		let result;
		if (Array.isArray(item)) {
			if (!includeComments)
				item = item.filter(n => n.nodeType !==8)

			result = item.map(n => n.nodeType === 8 ? `<!--${n.textContent}-->` : n.outerHTML || n.textContent).join('|')
		}
		else
			result = item.outerHTML || item.textContent

		if (!includeComments)
			result = result.replace(/(<|\x3C)!--(.*?)-->/g, '')

		return result;
	}
}



let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
	colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
	nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random (max) {
	return Math.round(Math.random() * 1000) % max
}

function buildData(count) {
	let data = new Array(count);
	for (let i = 0; i < count; i++) {
		data[i] = {
			id: idCounter++,
			label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
		}
	}
	return data;
}




class JSFrameworkBenchmark extends Solarite {
	data = [];
	selectedId = null;

	// quickly mimic what the js-framework-benchmark does.
	// This is useful to see if performance changes after code modifications.
	async benchmark(runs=1) {
		let times = [];
		let results = [];

		// Helper function to calculate geometric mean
		const geometricMean = (arr) => {
			return Math.pow(arr.reduce((a, b) => (a || .1) * (b || .1), 1), 1 / arr.length);
		};

		const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

		const run = async (name, callback) => {
			const start = performance.now();
			callback();
			const time = performance.now() - start;
			times.push(time);
			console.log(`${name}: ${time.toFixed(2)}ms.`);
			await sleep(20); // wait for render before starting next test.
		}

		// Time the creation of rows
		for (let i=0; i<runs; i++) {
			times = [];

			// Helper function to calculate geometric mean
			const geometricMean = (arr) => {
				return Math.pow(arr.reduce((a, b) => (a || .1) * (b||.1), 1), 1 / arr.length);
			};

			await run('Create Rows', () => this.runBench());
			await run('Replace All Rows', () => this.runBench());
			await run('Partial Update', () => this.updateBench());
			await run('Select Row', () => this.setSelectedBench(this.data[1]));
			await run('Swap Rows', () => this.swapRowsBench());
			await run('Remove Row', () => this.removeBench(this.data[1].id));
			await run('Clear Rows', () => this.clearBench());
			await run('Create Many Rows', () => this.runLotsBench());
			await run('Append Rows', () => this.addBench());
			await run('Clear Rows', () => this.clearBench());

			// Log the geometric mean of all steps
			const geoMean = geometricMean(times);
			results.push(geoMean);
			console.log(`*** Geometric mean: ${geoMean.toFixed(2)}ms`);
		}

		if (runs > 1) {
			console.log('---');
			let cold = results[0];
			let warm = results.slice(1);
			let warmAvg = warm.reduce((a, b) => a + b) / warm.length;
			let best = Math.min(...results);
			console.log(`Cold: ${cold}ms`);
			console.log(`Warm avg: ${warmAvg}ms`);
			console.log(`Best: ${best}ms`);

			if (window.parent && window.parent.onBenchmarkComplete) {
				window.parent.onBenchmarkComplete(warmAvg, best, cold);
			}
		} else if (Number(runs) === 1 && results.length > 0) {
			if (window.parent && window.parent.onBenchmarkComplete) {
				window.parent.onBenchmarkComplete(results[0], results[0]);
			}
		}
	}

	runBench() {
		this.data = buildData(1000);
		this.selectedId = null;
		this.render()
	}

	runLotsBench() {
		this.data = buildData(10_000);
		this.selectedId = null;
		this.render()
	}

	addBench() {
		this.data.push(...buildData(1000));
		this.render();
	}

	updateBench() {
		let len = this.data.length;
		for (let i=0; i<len; i+=10)
			this.data[i].label += ' !!!';
		this.render()
	}

	swapRowsBench() {
		if (this.data.length > 998) {

			let temp = this.data[1];
			this.data[1] = this.data[998];
			this.data[998] = temp;
			this.render()
		}
	}

	clearBench() {
		this.data = [];
		this.selectedId = null;
		this.render()
	}

	removeBench(id) {
		let index = this.data.findIndex(row=>row.id===id);
		if (this.selectedId === id)
			this.selectedId = null;
		this.data.splice(index, 1);
		this.render();
	}

	setSelectedBench(row) {
		this.selectedId = row.id;
		this.render();
	}

	render() {
		let options = {ids: false, scripts: false, styles: false, eventDelegation: true};
		h(this, options)`
		<div class="container">
			<div class="jumbotron">
				<div class="row">
					<div class="col-md-6">
						<h1>Solarite (keyed)</h1>
					</div>
					<div class="col-md-6">
						<div class="row">
							<div class="col-sm-6 smallpad">
								<button id="run" class="btn btn-primary btn-block" type="button"
									onclick=${this.runBench}>Create 1,000 rows</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button id="runlots" class="btn btn-primary btn-block" type="button"
									onclick=${this.runLotsBench}>Create 10,000 rows</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button id="add" class="btn btn-primary btn-block" type="button"
									onclick=${this.addBench}>Append 1,000 rows</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button id="update" class="btn btn-primary btn-block" type="button"
									onclick=${this.updateBench}>Update every 10th row</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button id="clear" class="btn btn-primary btn-block" type="button"
									onclick=${this.clearBench}>Clear</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button id="swaprows" class="btn btn-primary btn-block" type="button"
									onclick=${this.swapRowsBench}>Swap Rows</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<table class="table table-hover table-striped test-data"><tbody>
				${this.data.map(row =>
					h.memo(row, [row.label, row.id === this.selectedId], row =>
					h`<tr key=${row.id} class=${row.id === this.selectedId ? 'danger' : ''}><td class="col-md-1">${row.id}</td><td class="col-md-4"><a onclick=${[this.setSelectedBench, row]}>${row.label}</a></td><td class="col-md-1"><a onclick=${[this.removeBench, row.id]}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`))
				}
			</tbody></table>
		</div>`;

		return this.modifications;
	}
}

let app = new JSFrameworkBenchmark();
document.body.append(app);

if (benchmark)
	app.benchmark(benchmark);
else if (run)
	app.run();
