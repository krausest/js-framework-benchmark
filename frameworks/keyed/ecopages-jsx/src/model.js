import { state } from '@ecopages/signals';

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];
const random = (max) => Math.round(Math.random() * 1000) % max;
let nextId = 1;

const buildRows = (count) =>
	Array.from({ length: count }, () => ({
		id: nextId++,
		label: state(`${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`),
		cls: state(''),
	}));

export class Model {
	rows = state([]);
	#selected;

	run = () => {
		this.#selected = undefined;
		this.rows.set(buildRows(1000));
	};

	runLots = () => {
		this.#selected = undefined;
		this.rows.set(buildRows(10000));
	};

	add = () => {
		this.rows.set([...this.rows.get(), ...buildRows(1000)]);
	};

	update = () => {
		const rows = this.rows.get();
		for (let index = 0; index < rows.length; index += 10) rows[index].label.set(`${rows[index].label.get()} !!!`);
	};

	clear = () => {
		this.#selected = undefined;
		this.rows.set([]);
	};

	swapRows = () => {
		const rows = this.rows.get();
		if (rows.length <= 998) return;
		const next = rows.slice();
		[next[1], next[998]] = [next[998], next[1]];
		this.rows.set(next);
	};

	select(row) {
		if (row === this.#selected) return;
		this.#selected?.cls.set('');
		row.cls.set('danger');
		this.#selected = row;
	}

	remove(row) {
		if (row === this.#selected) this.#selected = undefined;
		this.rows.set(this.rows.get().filter((candidate) => candidate !== row));
	}
}
