const A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean',
	'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive',
	'cheap', 'expensive', 'fancy'];
const C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse',
	'keyboard'];

function random(max) {
	return Math.floor(Math.random() * 1000) % max;
}

let nextId = 1;

function buildData(count) {
	const data = new Array(count);
	for (let i = 0; i < count; i++) {
		data[i] = {
			id: nextId++,
			label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
		};
	}
	return data;
}

export function state() {
	return { rows: [], selected: null };
}

export function onAdd({ state, setState }) {
	setState({ rows: state.rows.concat(buildData(1000)) });
}

export function onClear({ setState }) {
	setState({ rows: [], selected: null });
}

export function onPartialUpdate({ state, setState }) {
	const rows = state.rows.slice();

	for (let i = 0; i < rows.length; i += 10) {
		rows[i].label += ' !!!';
	}

	setState({ rows });
}

export function onRemove(item, { state, setState }) {
	const { rows } = state;
	const ix = rows.indexOf(item);
	setState({
		rows: [...rows.slice(0, ix), ...rows.slice(ix + 1)]
	});
}

export function onRun({ setState }) {
	setState({ rows: buildData(1000), selected: null });
}

export function onRunLots({ setState }) {
	setState({ rows: buildData(10000), selected: null });
}

export function onSwapRows({ state, setState }) {
	const rows = state.rows.slice();

	if (rows.length > 998) {
		[rows[1], rows[998]] = [rows[998], rows[1]];

		setState({ rows });
	}
}
