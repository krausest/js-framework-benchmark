import { create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

function random(max: number) {
	return Math.round(Math.random() * 1000) % max;
}

export interface Data {
	id: number;
	label: string;
}

const adjectives = [
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
	'fancy'
];

const colours = [
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
	'orange'
];

const nouns = [
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
	'keyboard'
];

const factory = create({ icache });

export default factory(({ middleware: { icache }}) => {
	let id = 1;
	function buildData(count: number = 1000): Data[] {
		let data = [];
		for (let i = 0; i < count; i++) {
			const adjective = adjectives[random(adjectives.length)];
			const colour = colours[random(colours.length)];
			const noun = nouns[random(nouns.length)];
			const label = `${adjective} ${colour} ${noun}`;
			data.push({id: id++, label });
		}
		return data;
	}

	return {
		get data(): Data[] {
			return icache.get('data') || [];
		},
		get selected(): number | undefined {
			return icache.get('selected');
		},
		del: (id: number) => {
			const data = icache.get<Data[]>('data') || [];
			const idx = data.findIndex((item) => item.id === id);
			data.splice(idx, 1);
			icache.set('data', data);
		},
		run: () => {
			icache.set('selected', undefined);
			icache.set('data', buildData());
		},
		add: () => {
			const data = icache.get<Data[]>('data') || [];
			icache.set('data', [ ...data, ...buildData() ]);
		},
		update: () => {
			const data = icache.get<Data[]>('data') || [];
			for (let i = 0; i < data.length; i += 10) {
				const item = data[i];
				data[i] = { ...item, label: `${item.label} !!!`};
			}
			icache.set('data', data);
		},
		select: (id: number) => {
			icache.set('selected', id);
		},
		runLots: () => {
			icache.set('selected', undefined);
			icache.set('data', buildData(10000));
		},
		clear: () => {
			icache.set('selected', undefined);
			icache.set('data', []);
		},
		swapRows: () => {
			const data = icache.get<Data[]>('data') || [];
			if (data.length > 998) {
				const row = data[1];
				data[1] = data[998];
				data[998] = row;
			}	
			icache.set('data', data);
		}
	}
});
