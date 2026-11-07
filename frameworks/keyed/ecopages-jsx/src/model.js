import { state } from '@ecopages/signals';

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];
const random = (max) => Math.round(Math.random() * 1000) % max;
let nextId = 1;

/** A row whose label and selected class are signals, so changing either updates only its own text or attribute. */
const buildData = (count) =>
	Array.from({ length: count }, () => ({
		id: nextId++,
		label: state(`${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`),
		cls: state(''),
	}));

/** Benchmark state as signals: the row list changes only on create, append, swap, remove and clear. */
export class Model {
	rows = state([]);
	selected = null;

	run() {
		this.selected = null;
		this.rows.set(buildData(1000));
	}
	runlots() {
		this.selected = null;
		this.rows.set(buildData(10000));
	}
	add() {
		this.rows.set([...this.rows.get(), ...buildData(1000)]);
	}
	update() {
		const rows = this.rows.get();
		for (let index = 0; index < rows.length; index += 10) rows[index].label.set(`${rows[index].label.get()} !!!`);
	}
	clear() {
		this.selected = null;
		this.rows.set([]);
	}
	swaprows() {
		const rows = this.rows.get();
		if (rows.length > 998) {
			const next = rows.slice();
			[next[1], next[998]] = [next[998], next[1]];
			this.rows.set(next);
		}
	}
	select(id) {
		const row = this.rows.get().find((candidate) => candidate.id === id);
		if (!row || row === this.selected) return;
		this.selected?.cls.set('');
		row.cls.set('danger');
		this.selected = row;
	}
	remove(id) {
		if (this.selected?.id === id) this.selected = null;
		this.rows.set(this.rows.get().filter((row) => row.id !== id));
	}
}

export const buttons = [['run', 'Create 1,000 rows'], ['runlots', 'Create 10,000 rows'], ['add', 'Append 1,000 rows'], ['update', 'Update every 10th row'], ['clear', 'Clear'], ['swaprows', 'Swap Rows']];
