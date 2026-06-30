import { h, component, App } from 'literaljs';

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

const AppComponent = component({
	state: { data: [], selected: null },
	methods() {
		return {
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
	},
	render() {
		const { data, selected } = this.getState();
		return h('div', { class: 'container' }, [
			h('div', { class: 'jumbotron' },
				h('div', { class: 'row' }, [
					h('div', { class: 'col-md-6' }, h('h1', {}, 'LiteralJS (non-keyed)')),
					h('div', { class: 'col-md-6' },
						h('div', { class: 'row' }, [
							h('div', { class: 'col-sm-6 smallpad' },
								h('button', {
									type: 'button',
									class: 'btn btn-primary btn-block',
									id: 'run',
									events: { click: () => this.run() }
								}, 'Create 1,000 rows')
							),
							h('div', { class: 'col-sm-6 smallpad' },
								h('button', {
									type: 'button',
									class: 'btn btn-primary btn-block',
									id: 'runlots',
									events: { click: () => this.runLots() }
								}, 'Create 10,000 rows')
							),
							h('div', { class: 'col-sm-6 smallpad' },
								h('button', {
									type: 'button',
									class: 'btn btn-primary btn-block',
									id: 'add',
									events: { click: () => this.add() }
								}, 'Append 1,000 rows')
							),
							h('div', { class: 'col-sm-6 smallpad' },
								h('button', {
									type: 'button',
									class: 'btn btn-primary btn-block',
									id: 'update',
									events: { click: () => this.update() }
								}, 'Update every 10th row')
							),
							h('div', { class: 'col-sm-6 smallpad' },
								h('button', {
									type: 'button',
									class: 'btn btn-primary btn-block',
									id: 'clear',
									events: { click: () => this.clear() }
								}, 'Clear')
							),
							h('div', { class: 'col-sm-6 smallpad' },
								h('button', {
									type: 'button',
									class: 'btn btn-primary btn-block',
									id: 'swaprows',
									events: { click: () => this.swapRows() }
								}, 'Swap Rows')
							)
						])
					)
				])
			),
			h('table', { class: 'table table-hover table-striped test-data' },
				h('tbody', { id: 'tbody' },
					data.map(item =>
						h('tr', {
							class: item.id === selected ? 'danger' : ''
						}, [
							h('td', { class: 'col-md-1' }, String(item.id)),
							h('td', { class: 'col-md-4' },
								h('a', {
									events: { click: () => this.select(item.id) }
								}, item.label)
							),
							h('td', { class: 'col-md-1' },
								h('a', null,
									h('span', {
										class: 'glyphicon glyphicon-remove',
										'aria-hidden': 'true',
										events: { click: () => this.delete(item.id) }
									})
								)
							),
							h('td', { class: 'col-md-6' })
						])
					)
				)
			),
			h('span', {
				class: 'preloadicon glyphicon glyphicon-remove',
				'aria-hidden': 'true'
			})
		]);
	}
});

const app = new App(AppComponent, {});
app.mount('root');
