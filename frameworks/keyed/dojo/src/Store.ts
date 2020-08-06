import { create, invalidator } from '@dojo/framework/core/vdom';

function random(max: number) {
	return Math.round(Math.random() * 1000) % max;
}

export interface Item {
	id: number;
	label: string;
}

export interface Data {
	[index: string]: Item;
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

const factory = create({ invalidator });

let id = 1;
let data: Data = {};
let ids = new Set<number>();
let selected: number | undefined;
let invalidatorMap = new Map<number | string, Function>();
let appInvalidator: Function;

function buildData(count: number = 1000): { data: Data; ids: Set<number> } {
	const data: Data = {};
	const ids = new Set<number>();
	for (let i = 0; i < count; i++) {
		const adjective = adjectives[random(adjectives.length)];
		const colour = colours[random(colours.length)];
		const noun = nouns[random(nouns.length)];
		const label = `${adjective} ${colour} ${noun}`;
		data[id] = { id, label };
		ids.add(id);
		id = id + 1;
	}
	return { data, ids };
}

export default factory(({ properties, middleware: { invalidator }}) => {
	const { key: widgetKey = 'app' } = properties();
	if (widgetKey === 'app') {
		appInvalidator = invalidator;
	} else {
		invalidatorMap.set(widgetKey, invalidator);
	}

	function invalidate(id: string | number = 'app') {
		if (id === 'app') {
			appInvalidator();
		} else if (invalidatorMap.has(id)) {
			invalidatorMap.get(id)!();
		}
	}

	return {
		get ids(): number[] {
			return Array.from(ids);
		},
		get item(): Item | undefined {
			return data[widgetKey];
		},
		get selected(): number | undefined {
			return selected;
		},
		chunks(size = 500): string[] {
			const ids = this.ids;
			const chunks: string[] = [];
			for (let i = 0; i < ids.length; i+=size) {
				chunks.push(JSON.stringify(ids.slice(i, i + size)));
			}
			return chunks;
		},
		del: () => {
			if (typeof widgetKey === 'number') {
				ids.delete(widgetKey);
				delete data[widgetKey];
				invalidate(widgetKey);
			}
		},
		run: () => {
			const builtData = buildData();
			ids = builtData.ids;
			data = builtData.data;
			selected = undefined;
			invalidate();
			invalidatorMap.clear();
		},
		add: () => {
			const builtData = buildData();
			data = { ...data, ...builtData.data };
			ids = new Set([...ids, ...builtData.ids]);
			invalidate();
		},
		update: () => {
			const idArray = [ ...ids ];
			for (let i = 0; i < idArray.length; i += 10) {
				const itemId = idArray[i];
				const item = data[itemId];
				data[itemId] = { ...item, label: `${item.label} !!!`};
				invalidate(itemId);
			}
		},
		select: (id: number) => {
			selected && invalidate(selected);
			invalidate(id);
			selected = id;
		},
		runLots: () => {
			const builtData = buildData(10000);
			ids = builtData.ids;
			data = builtData.data;
			selected = undefined;
			invalidate();
			invalidatorMap.clear();
		},
		clear: () => {
			data = {};
			ids.clear();
			selected = undefined;
			invalidate();
			invalidatorMap.clear();
		},
		swapRows: () => {
			const idArray = [ ...ids ];
			if (idArray.length > 998) {
				const row = idArray[1];
				idArray[1] = idArray[998];
				idArray[998] = row;
			}
			ids = new Set(idArray);
			invalidate();
		}
	}
});
