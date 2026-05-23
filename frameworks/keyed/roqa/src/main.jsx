import { defineComponent, cell, get, put, set } from "roqa";

const adjectives = [
	"pretty",
	"large",
	"big",
	"small",
	"tall",
	"short",
	"long",
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
	"brown",
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

const rand = (dict) => dict[Math.round(Math.random() * 1000) % dict.length];

function App() {
	let rowId = 1;
	const rows = cell([]);
	const selectedRow = cell(null);

	function buildData(count = 1000) {
		const data = new Array(count);
		for (let i = 0; i < count; i++) {
			const text = rand(adjectives) + " " + rand(colours) + " " + rand(nouns);
			data[i] = {
				id: rowId++,
				label: cell(text),
			};
		}
		return data;
	}

	const run = () => {
		set(rows, buildData(1000));
	};

	const runLots = () => {
		set(rows, buildData(10000));
	};

	const add = () => {
		set(rows, [...get(rows), ...buildData(1000)]);
	};

	const clear = () => {
		set(rows, []);
		put(selectedRow, null);
	};

	const updateRows = () => {
		for (let i = 0, row; (row = get(rows)[i]); i += 10) {
			set(row.label, get(row.label) + " !!!");
		}
	};

	const swapRows = () => {
		if (get(rows).length > 998) {
			const clone = get(rows).slice();
			const temp = clone[1];
			clone[1] = clone[998];
			clone[998] = temp;
			set(rows, clone);
		}
	};

	const select = (row) => {
		set(selectedRow, row);
	};

	const remove = (row) => {
		const clone = get(rows).slice();
		clone.splice(clone.indexOf(row), 1);
		set(rows, clone);
	};

	return (
		<div class="container">
			<div class="jumbotron">
				<div class="row">
					<div class="col-md-6">
						<h1>Roqa</h1>
					</div>
					<div class="col-md-6">
						<div class="row">
							<div class="col-sm-6 smallpad">
								<button type="button" class="btn btn-primary btn-block" id="run" onclick={run}>
									Create 1,000 rows
								</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button
									type="button"
									class="btn btn-primary btn-block"
									id="runlots"
									onclick={runLots}
								>
									Create 10,000 rows
								</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button type="button" class="btn btn-primary btn-block" id="add" onclick={add}>
									Append 1,000 rows
								</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button
									type="button"
									class="btn btn-primary btn-block"
									id="update"
									onclick={updateRows}
								>
									Update every 10th row
								</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button type="button" class="btn btn-primary btn-block" id="clear" onclick={clear}>
									Clear
								</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button
									type="button"
									class="btn btn-primary btn-block"
									id="swaprows"
									onclick={swapRows}
								>
									Swap Rows
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<table class="table table-hover table-striped test-data">
				<tbody>
					<For each={rows}>
						{(row) => (
							<tr class={get(selectedRow) === row ? "danger" : ""}>
								<td class="col-md-1">{row.id}</td>
								<td class="col-md-4">
									<a onclick={() => select(row)}>{get(row.label)}</a>
								</td>
								<td class="col-md-1">
									<a onclick={() => remove(row)}>
										<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
									</a>
								</td>
								<td class="col-md-6"></td>
							</tr>
						)}
					</For>
				</tbody>
			</table>
			<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
		</div>
	);
}

defineComponent("roqa-app", App);
