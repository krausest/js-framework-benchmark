import { arraySignal, each, render, signal } from "@knno/jsx";

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]; // prettier-ignore
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]; // prettier-ignore
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]; // prettier-ignore

const random = (max: number) => Math.round(Math.random() * 1000) % max;
let nextId = 1;
const buildData = (count: number) => {
	const data = new Array(count);
	for (let i = 0; i < count; i++)
		data[i] = { id: nextId++, label: `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}` };
	return data;
};

const Button = ({ id, text, fn }: { id: string; text: string; fn: () => void }) => (
	<div class="col-sm-6 smallpad">
		<button id={id} class="btn btn-primary btn-block" type="button" onClick={fn}>{text}</button>
	</div>
);

render(() => {
	const [data, setData, editor] = arraySignal<{ id: number; label: string }>([]);
	const [selected, setSelected] = signal<number | null>(null);

	const run = () => setData(buildData(1_000));
	const runLots = () => setData(buildData(10_000));
	const add = () => editor.push(...buildData(1_000));
	const update = () => {
		const d = data();
		const indices = [];
		for (let i = 0, len = d.length; i < len; i += 10) indices.push(i);
		editor.update(indices, (r) => { r.label += " !!!"; }, ["label"]);
	};
	const clear = () => setData([]);
	const swapRows = () => {
		if (data.value.length > 998) {
			editor.move(998, 1);
			editor.move(2, 998);
		}
	};
	const deleteRow = (id: number) => {
		const idx = data().findIndex((r) => r.id === id);
		if (idx >= 0) editor.remove(idx);
		if (selected.value === id) setSelected(null);
	};

	return (
		<div class="container">
			<div class="jumbotron">
				<div class="row">
					<div class="col-md-6"><h1>knno-jsx-keyed</h1></div>
					<div class="col-md-6">
						<div class="row">
							<Button id="run" text="Create 1,000 rows" fn={run} />
							<Button id="runlots" text="Create 10,000 rows" fn={runLots} />
							<Button id="add" text="Append 1,000 rows" fn={add} />
							<Button id="update" text="Update every 10th row" fn={update} />
							<Button id="clear" text="Clear" fn={clear} />
							<Button id="swaprows" text="Swap Rows" fn={swapRows} />
						</div>
					</div>
				</div>
			</div>
			<table class="table table-hover table-striped test-data">
				<tbody>
					{each(data, (row, value) => {
						return (
						<tr class={() => {
							// 使用 keyed 订阅，O(1) 查找
							return selected({ key: row.id }) === row.id ? "danger" : "";
						}}>
							<td class="col-md-1">{row.id}</td>
							<td class="col-md-4"><a onClick={() => setSelected(row.id, { key: [selected.value, row.id] })}>{() => value("label", () => row.label)}</a></td>
							<td class="col-md-1"><a onClick={() => deleteRow(row.id)}><span class="glyphicon glyphicon-remove" aria-hidden="true" /></a></td>
							<td class="col-md-6" />
						</tr>);
					})}
				</tbody>
			</table>
			<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
		</div>
	);
}, "#main");
