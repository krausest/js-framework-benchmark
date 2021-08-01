const {
	hook_dom,
	hook_reducer,
	hook_static,
	init,
	node,
	node_dom,
	node_map,
} = lui;


/// STORE ///

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const pick = options => (
	options[
		Math.round(
			Math.random() *
			(options.length - 1)
		)
	]
);

let id_counter = 0;

const item_generate = () => ({
	id: ++id_counter,
	label: `${pick(adjectives)} ${pick(colors)} ${pick(nouns)}`,
});

const ACTION_RESET = 0;
const ACTION_CREATE = 1;
const ACTION_ADD = 2;
const ACTION_REMOVE = 3;
const ACTION_SELECT = 4;
const ACTION_UPDATE = 5;
const ACTION_SWAP = 6;

const actions = [
	// RESET
	() => ({
		data: [],
		selected: null,
	}),
	
	// CREATE
	(state, count) => ({
		...state,
		data: (
			new Array(count)
			.fill(null)
			.map(item_generate)
		),
		selected: null,
	}),
	
	// ADD
	(state, count) => ({
		...state,
		data: [
			...state.data,
			...(
				new Array(count)
				.fill(null)
				.map(item_generate)
			),
		],
	}),
	
	// REMOVE
	(state, id) => ({
		...state,
		data: state.data.filter(item => item.id !== id),
		selected: (
			state.selected === id
			?	null
			:	state.selected
		),
	}),
	
	// SELECT
	(state, id) => ({
		...state,
		selected: id,
	}),
	
	// UPDATE
	(state, mod) => ({
		...state,
		data: state.data.map((item, index) =>
			index % mod > 0
			?	item
			:	{
					...item,
					label: item.label + ' !!!',
				}
		),
	}),
	
	// SWAP
	(state) => ({
		...state,
		data: (
			state.data.length > 998
			?	[
					state.data[0],
					state.data[998],
					...state.data.slice(2, 998),
					state.data[1],
					...state.data.slice(999),
				]
			:	state.data
		),
	}),
];


/// COMPONENTS ///

const Jumbotron = ({
	dispatch,
}) => (
	hook_dom('div[className=jumbotron]'),
	[
		node_dom('div[className=row]', null, [
			node_dom('td[className=col-md-6]', null, [
				node_dom('h1[innerText=lui]'),
			]),
			node_dom('td[className=col-md-6]', null,
				[
					{
						id: 'run', label: 'Create 1,000 rows',
						click: () => dispatch(ACTION_CREATE, 1e3),
					}, {
						id: 'runlots', label: 'Create 10,000 rows',
						click: () => dispatch(ACTION_CREATE, 1e4),
					}, {
						id: 'add', label: 'Append 1,000 rows',
						click: () => dispatch(ACTION_ADD, 1e3),
					}, {
						id: 'update', label: 'Update every 10th row',
						click: () => dispatch(ACTION_UPDATE, 10),
					}, {
						id: 'clear', label: 'Clear',
						click: () => dispatch(ACTION_RESET),
					}, {
						id: 'swaprows', label: 'Swap Rows',
						click: () => dispatch(ACTION_SWAP),
					},
				].map(item =>
					node_dom('div[className=col-sm-6 smallpad]', null, [
						node_dom('button[type=button][className=btn btn-primary btn-block]', {
							id: item.id,
							innerText: item.label,
							onclick: item.click,
						}),
					])
				)
			),
		]),
	]
);

const Row = ({
	I: {
		id,
		label,
	},
	dispatch,
	selected,
}) => (
	hook_dom('tr', {
		F: {
			danger: selected === id,
		},
	}),
	[
		node_dom('td[className=col-md-1]', {
			innerText: id,
		}),
		node_dom('td[className=col-md-4]', null, [
			node_dom('a', {
				innerText: label,
				onclick: hook_static(() => {
					dispatch(ACTION_SELECT, id);
				}),
			}),
		]),
		node_dom('td[className=col-md-1]', null, [
			node_dom('a', {
				onclick: hook_static(() => {
					dispatch(ACTION_REMOVE, id);
				}),
			}, [
				node_dom('span[className=glyphicon glyphicon-remove][ariaHidden]'),
			]),
		]),
		node_dom('td[className=col-md-6]'),
	]
);

init(() => {
	const [store, dispatch] = hook_reducer(actions);
	
	return [null, [
		node_dom('div[className=container]', null, [
			node(Jumbotron, {
				dispatch,
			}),
			node_dom('table[className=table table-hover table-striped test-data]', null, [
				node_dom('tbody', null, [
					node_map(Row, store.data, {
						dispatch,
						selected: store.selected,
					}),
				]),
			]),
			node_dom('span[className=preloadicon glyphicon glyphicon-remove][ariaHidden]'),
		]),
	]];
});
