import { observable, h } from 'sinuous';
import { template, t, o } from 'sinuous/template';
import map from 'sinuous/map';

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
	colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
	nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random (max) { return Math.round(Math.random() * 1000) % max; }

function buildData(count) {
	let data = new Array(count);
	for (let i = 0; i < count; i++) {
		data[i] = {
			id: idCounter++,
			label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
		};
	}
	return data;
}

function getParentId(node) {
	do {
		if (node.props && node.props.id) {
			return node.props.id;
		}
	} while ((node = node.parentNode));
}

const App = () => {
	const data = observable([]);
	const run = () => data(buildData(1000)) && selected(null);
	const runLots = () => data(buildData(10000)) && selected(null);
	const add = () => data(data().concat(buildData(1000)));
	const clear = () => data([]) && selected(null);
	const removeOrSelect = (e) => e.target.matches('.remove') ? remove(e) : select(e);
	const select = (e) => selected(getParentId(e.target));

	let rowObject;
	const selected = (id) => {
		if (rowObject) rowObject.selected = '';
		const d = data();
		if (id && (rowObject = d.find(d => d.id === id))) {
			rowObject.selected = 'danger';
		}
	};

	const update = () => {
		const d = data();
		for (let i = 0; i < d.length; i += 10) {
			d[i].label += ' !!!';
		}
	};

	const swapRows = () => {
		const d = data();
		if (d.length > 998) {
			const tmp = d[1];
			d[1] = d[998];
			d[998] = tmp;
			data(d);
		}
	};

	const remove = (e) => {
		const d = data();
		const idx = d.findIndex(d => d.id === getParentId(e.target));
		d.splice(idx, 1);
		data(d);
	};

	const Button = ({ id, text, fn }) => html`
		<div class="col-sm-6 smallpad">
			<button id="${ id }" class="btn btn-primary btn-block" type=button onclick=${() => fn}>
				${ text }
			</button>
		</div>`;

	const Row = template(() => html`
		<tr class=${ o('selected') }>
			<td class=col-md-1>${ t('id') }</td>
			<td class=col-md-4><a>${ o('label') }</a></td>
			<td class=col-md-1><a>
				<span class="glyphicon glyphicon-remove remove" aria-hidden=true />
			</a></td>
			<td class=col-md-6 />
		</tr>
	`);

	return html`<div class=container>
		<div class=jumbotron><div class=row>
			<div class=col-md-6><h1>Sinuous Keyed</h1></div>
			<div class=col-md-6><div class=row>
				<${Button} id=run text="Create 1,000 rows" fn=${ run } />
				<${Button} id=runlots text="Create 10,000 rows" fn=${ runLots } />
				<${Button} id=add text="Append 1,000 rows" fn=${ add } />
				<${Button} id=update text="Update every 10th row" fn=${ update } />
				<${Button} id=clear text=Clear fn=${ clear } />
				<${Button} id=swaprows text="Swap Rows" fn=${ swapRows } />
			</div></div>
		</div></div>
		<table class="table table-hover table-striped test-data">
			<tbody onclick=${() => removeOrSelect}>
				${map(data, Row)}
			</tbody>
		</table>
		<span class="preloadicon glyphicon glyphicon-remove" aria-hidden=true />
	</div>`;
};

document.getElementById('main').appendChild(App());
