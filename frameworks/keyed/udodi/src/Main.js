import { createComponent, html, render } from "udodi";

const adjectives = [
	"pretty",
	"large",
	"big",
	"small",
	"tall",
	"short",
	"handsome",
	"plain",
	"quaint",
	"clean",
	"elegant",
	"easy",
	"angry",
	"crazy",
	"helpful",
	"mushy",
	"odd",
	"unsightly",
	"adorable",
	"important",
	"inexpensive",
	"cheap",
	"expensive",
	"fancy",
];

const colours = [
	"red",
	"yellow",
	"blue",
	"green",
	"pink",
	"brown",
	"purple",
	"white",
	"black",
	"orange",
];

const nouns = [
	"table",
	"chair",
	"house",
	"bbq",
	"desk",
	"car",
	"pony",
	"cookie",
	"sandwich",
	"burger",
	"pizza",
	"mouse",
	"keyboard",
];

let nextId = 1;

/**
 * Returns a pseudo-random integer in the range [0, max).
 *
 * @param {number} max - Exclusive upper bound.
 * @returns {number} Random index.
 */
function random(max) {
	return Math.round(Math.random() * 1000) % max;
}

/**
 * Creates benchmark rows.
 *
 * @param {number} count - Number of rows to create.
 * @returns {Array<{id: number, label: string}>} Generated rows.
 */
function buildData(count) {
	const data = new Array(count);

	for (let i = 0; i < count; i++) {
		data[i] = {
			id: nextId++,
			label:
				adjectives[random(adjectives.length)] + " " +
				colours[random(colours.length)] + " " +
				nouns[random(nouns.length)],
		};
	}

	return data;
}

const BenchmarkApp = createComponent({
	name: "UdodiBenchmark",

	state() {
		return {
			data: [],
			selectedId: null,
		};
	},

	methods: {
		run() {
			this.data = buildData(1000);
			this.selectedId = null;
		},

		runLots() {
			this.data = buildData(10000);
			this.selectedId = null;
		},

		add() {
			this.data.push(...buildData(1000));
		},

		update() {
			for (let i = 0, len = this.data.length; i < len; i += 10) {
				const row = this.data[i];

				this.data[i] = {
					id: row.id,
					label: row.label + " !!!",
				};
			}
		},

		clear() {
			this.data.length = 0;
			this.selectedId = null;
		},

		swapRows() {
			if (this.data.length > 998) {
				const first = this.data[1];
				const last = this.data[998];

				this.data[1] = last;
				this.data[998] = first;
			}
		},

		select(event, id) {
			this.selectedId = id;
		},

		isSelected(id) {
			return this.selectedId === id;
		},

		removeRow(event, id) {
			const index = this.data.findIndex((row) => row.id === id);

			if (index === -1) {
				return;
			}

			this.data.splice(index, 1);

			if (this.selectedId === id) {
				this.selectedId = null;
			}
		},
	},

	template: html`
		<div class="container">
			<div class="jumbotron">
				<div class="row">
					<div class="col-md-6">
						<h1>Udodi-"keyed"</h1>
					</div>

					<div class="col-md-6">
						<div class="row">
							<div class="col-sm-6 smallpad">
								<button
									type="button"
									class="btn btn-primary btn-block"
									id="run"
									@on="click=run"
								>
									Create 1,000 rows
								</button>
							</div>

							<div class="col-sm-6 smallpad">
								<button
									type="button"
									class="btn btn-primary btn-block"
									id="runlots"
									@on="click=runLots"
								>
									Create 10,000 rows
								</button>
							</div>

							<div class="col-sm-6 smallpad">
								<button
									type="button"
									class="btn btn-primary btn-block"
									id="add"
									@on="click=add"
								>
									Append 1,000 rows
								</button>
							</div>

							<div class="col-sm-6 smallpad">
								<button
									type="button"
									class="btn btn-primary btn-block"
									id="update"
									@on="click=update"
								>
									Update every 10th row
								</button>
							</div>

							<div class="col-sm-6 smallpad">
								<button
									type="button"
									class="btn btn-primary btn-block"
									id="clear"
									@on="click=clear"
								>
									Clear
								</button>
							</div>

							<div class="col-sm-6 smallpad">
								<button
									type="button"
									class="btn btn-primary btn-block"
									id="swaprows"
									@on="click=swapRows"
								>
									Swap Rows
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<table class="table table-hover table-striped test-data">
				<tbody id="tbody">
					<tr
						@for="row data"
						@key="row.id"
						@class="isSelected:row.id=>'danger'"
					>
						<td class="col-md-1" @text="row.id"></td>

						<td class="col-md-4">
							<a @on="click=select:row.id" @text="row.label"></a>
						</td>

						<td class="col-md-1">
							<a @on="click=removeRow:row.id">
								<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
							</a>
						</td>

						<td class="col-md-6"></td>
					</tr>
				</tbody>
			</table>

			<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
		</div>
	`,
});

render(BenchmarkApp(), "#main");
