/**
 * LiteralJS v8 Keyed Entry for js-framework-benchmark
 *
 * To use:
 * 1. Copy this folder into frameworks/keyed/literaljs/
 * 2. Run `npm install` and `npm run build`
 * 3. Follow js-framework-benchmark README for running benchmarks
 */

import { h, component, App as AppBase } from 'literaljs';

let idCounter = 1;
function _random(max) { return Math.round(Math.random() * 1000) % max; }

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours  = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns    = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

function buildData(count) {
	const data = [];
	for (let i = 0; i < count; i++) {
		data.push({
			id: idCounter++,
			label: adjectives[_random(adjectives.length)] + ' ' + colours[_random(colours.length)] + ' ' + nouns[_random(nouns.length)]
		});
	}
	return data;
}

const Row = component({
	name: 'Row',
	render() {
		const { data, selected, onSelect, onDelete } = this.props;
		return h('tr', {
			key: data.id,
			class: selected ? 'danger' : ''
		}, [
			h('td', { class: 'col-md-1' }, String(data.id)),
			h('td', { class: 'col-md-4' },
				h('a', {
					events: { click: () => onSelect(data.id) }
				}, data.label)
			),
			h('td', { class: 'col-md-1' },
				h('a', {
					events: { click: () => onDelete(data.id) }
				},
					h('span', { class: 'glyphicon glyphicon-remove', 'aria-hidden': 'true' })
				)
			),
			h('td', { class: 'col-md-6' })
		]);
	}
});

const Table = component({
	name: 'Table',
	render() {
		const { data, selected, onSelect, onDelete } = this.props;
		return h('table', { class: 'table table-hover table-striped test-data' },
			h('tbody', {}, data.map(d =>
				Row({
					key: d.id,
					data: d,
					selected: selected === d.id,
					onSelect,
					onDelete
				})
			))
		);
	}
});

const App = component({
	name: 'App',
	state: { data: [], selected: null },
	render() {
		const { data, selected } = this.getState();

		return h('div', { class: 'container' }, [
			h('div', { class: 'jumbotron' },
				h('div', { class: 'row' }, [
					h('div', { class: 'col-md-6' }, h('h1', {}, 'LiteralJS')),
					h('div', { class: 'col-md-6' },
						h('div', { class: 'row' }, [
							this.Button('Create 1,000 rows', 'run', () => this.run()),
							this.Button('Create 10,000 rows', 'runlots', () => this.runLots()),
							this.Button('Append 1,000 rows', 'add', () => this.add()),
							this.Button('Update every 10th row', 'update', () => this.update()),
							this.Button('Clear', 'clear', () => this.clear()),
							this.Button('Swap Rows', 'swaprows', () => this.swapRows())
						])
					)
				])
			),
			Table({
				data,
				selected,
				onSelect: (id) => this.select(id),
				onDelete: (id) => this.delete(id)
			})
		]);
	},
	methods() {
		return {
			Button(label, id, onClick) {
				return h('div', { class: 'col-sm-6 smallpad' },
					h('button', {
						id,
						class: 'btn btn-primary btn-block',
						events: { click: onClick }
					}, label)
				);
			},
			run() { this.setState({ data: buildData(1000), selected: null }); },
			runLots() { this.setState({ data: buildData(10000), selected: null }); },
			add() {
				const data = this.getState().data;
				this.setState({ data: data.concat(buildData(1000)) });
			},
			update() {
				const data = this.getState().data.slice();
				for (let i = 0; i < data.length; i += 10) {
					data[i] = { ...data[i], label: data[i].label + ' !!!' };
				}
				this.setState({ data });
			},
			select(id) { this.setState({ selected: id }); },
			delete(id) {
				const data = this.getState().data.filter(d => d.id !== id);
				this.setState({ data });
			},
			clear() { this.setState({ data: [], selected: null }); },
			swapRows() {
				const data = this.getState().data.slice();
				if (data.length > 998) {
					const tmp = data[1];
					data[1] = data[998];
					data[998] = tmp;
					this.setState({ data });
				}
			}
		};
	}
});

const app = new AppBase(App, {});
app.mount('main');
