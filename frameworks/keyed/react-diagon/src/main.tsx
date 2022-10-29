// import './styles.css';
import { areSame, elements, ensureProxy } from 'diagon';
import { createReactRecorder } from 'diagon-react';
import { FC, memo, useState } from 'react';
import { createRoot } from 'react-dom/client';

const recorder = createReactRecorder();
const { useProjectedSnap, useSnap } = recorder;

interface Item {
	id: number,
	label: string
}

interface State {
	items: Item[],
	selected: Item | undefined;
}
const state: State = {
	items: [],
	selected: undefined,
};

const create = recorder.createMutator(state, (state, count: number) => {
	state.items = buildData(count);
});

const append = recorder.createMutator(state, (state, count: number) => {
	state.items.push(...buildData(count));
});

const clear = recorder.createMutator(state, state => {
	state.items.length = 0;
});

const swapRows = recorder.createMutator(state, state => {
	const items = state.items;
	if (items.length > 998) {
		const tmp = items[1];
		items[1] = items[998];
		items[998] = tmp;
	}
});

const remove = recorder.createMutator(state, (state, item: Item) => {
	const idx = state.items.findIndex((d) => areSame(d, item));
	state.items.splice(idx, 1);
});

const select = recorder.createMutator(state, (state, item: Item) => {
	state.selected = item;
});

const update = recorder.createMutator(state, state => {
	const items = state.items;
	const length = items.length;
	for (let i = 0, len = length; i < len; i += 10) {
		items[i].label += ' !!!';
	}
});

const random = (max: number) => Math.round(Math.random() * 1000) % max;

const A = [
	'pretty',
	'large',
	'big',
	'small',
	'tall',
	'short',
	'long',
	'handsome',
	'plain',
	'quaint',
	'clean',
	'elegant',
	'easy',
	'angry',
	'crazy',
	'helpful',
	'mushy',
	'odd',
	'unsightly',
	'adorable',
	'important',
	'inexpensive',
	'cheap',
	'expensive',
	'fancy',
];
const C = [
	'red',
	'yellow',
	'blue',
	'green',
	'pink',
	'brown',
	'purple',
	'brown',
	'white',
	'black',
	'orange',
];
const N = [
	'table',
	'chair',
	'house',
	'bbq',
	'desk',
	'car',
	'pony',
	'cookie',
	'sandwich',
	'burger',
	'pizza',
	'mouse',
	'keyboard',
];

let nextId = 1;

const buildData = (count: number) => {
	const data = new Array(count);

	for (let i = 0; i < count; i++) {
		data[i] = {
			id: nextId++,
			label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]
				}`,
		};
	}

	return data;
};

interface RowProps {
	item: Item
}

const selectedSelector = (state: State) => state.selected;

const Row: FC<RowProps> = memo(({ item }) => {
	const isSelected = useProjectedSnap(state, selectedSelector, state => areSame(state.selected, item), [item.id]);
	const label = useSnap(item, item => item.label);

	if ((item.id % 1000) === 0)
		console.log(item.id);

	return (
		<tr className={isSelected ? 'danger' : ''}>
			<td className="col-md-1">{item.id}</td>
			<td className="col-md-4">
				<a onClick={() => select(item)}>{label}</a>
			</td>
			<td className="col-md-1">
				<a onClick={() => remove(item)}>
					<span className="glyphicon glyphicon-remove" aria-hidden="true" />
				</a>
			</td>
			<td className="col-md-6" />
		</tr>
	);
});

interface ButtonProps {
	id: string,
	cb: () => void,
	title: string
}

const Button: FC<ButtonProps> = memo(({ id, cb, title }) => {
	return (
		<div className="col-sm-6 smallpad">
			<button
				type="button"
				className="btn btn-primary btn-block"
				id={id}
				onClick={cb}
			>
				{title}
			</button>
		</div>
	);
});

const Jumbotron: FC = memo(() => {
	return (
		<div className="jumbotron">
			<div className="row">
				<div className="col-md-6">
					<h1>React Diagon keyed</h1>
				</div>
				<div className="col-md-6">
					<div className="row">
						<Button id="run" title="Create 1,000 rows" cb={() => create(1000)} />
						<Button
							id="runlots"
							title="Create 10,000 rows"
							cb={() => create(10000)}
						/>
						<Button id="add" title="Append 1,000 rows" cb={() => append(1000)} />
						<Button
							id="update"
							title="Update every 10th row"
							cb={update}
						/>
						<Button id="clear" title="Clear" cb={() => clear()} />
						<Button id="swaprows" title="Swap Rows" cb={() => swapRows()} />
					</div>
				</div>
			</div>
		</div>
	);
});

const Main = () => {
	const [items] = useSnap(ensureProxy(state), state => [elements(state.items)]);
	return (
		<div className="container">
			<Jumbotron />
			<table className="table table-hover table-striped test-data">
				<tbody>
					{items.map((item) => (
						<Row key={item.id} item={item} />
					))}
				</tbody>
			</table>
			<span
				className="preloadicon glyphicon glyphicon-remove"
				aria-hidden="true"
			/>
		</div>
	);
};

export const App = () => {
	return (
		<Main />
	);
};

const container = document.getElementById('main');
const root = createRoot(container!);
root.render(<App />);