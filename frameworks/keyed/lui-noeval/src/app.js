const {
	hook_dom,
	hook_model,
	hook_static,
	init,
	node,
	node_dom,
	node_map,
} = lui;


/// STORE ///

const adjectives = 'pretty,large,big,small,tall,short,long,handsome,plain,quaint,clean,elegant,easy,angry,crazy,helpful,mushy,odd,unsightly,adorable,important,inexpensive,cheap,expensive,fancy'.split(',');
const colors = 'red,yellow,blue,green,pink,brown,purple,brown,white,black,orange'.split(',');
const nouns = 'table,chair,house,bbq,desk,car,pony,cookie,sandwich,burger,pizza,mouse,keyboard'.split(',');

const pick = options => (
	options[
		Math.round(
			Math.random() *
			(options.length - 1)
		)
	]
);

let id_counter = 0;

const todo_create = () => ({
	id: ++id_counter,
	label: `${pick(adjectives)} ${pick(colors)} ${pick(nouns)}`,
});

const model = {
	init: () => ({
		todos: [],
		selected: null,
	}),
	create: (state, count) => ({
		...state,
		todos: (
			new Array(count)
			.fill(null)
			.map(todo_create)
		),
		selected: null,
	}),
	add: (state, count) => ({
		...state,
		todos: [
			...state.todos,
			...(
				new Array(count)
				.fill(null)
				.map(todo_create)
			),
		],
	}),
	remove: (state, id) => ({
		...state,
		todos: state.todos.filter(item => item.id !== id),
		selected: (
			state.selected === id
			?	null
			:	state.selected
		),
	}),
	select: (state, id) => ({
		...state,
		selected: id,
	}),
	update: (state, mod) => ({
		...state,
		todos: state.todos.map((item, index) =>
			index % mod > 0
			?	item
			:	{
					...item,
					label: item.label + ' !!!',
				}
		),
	}),
	swap: (state) => ({
		...state,
		todos: (
			state.todos.length > 998
			?	[
					state.todos[0],
					state.todos[998],
					...state.todos.slice(2, 998),
					state.todos[1],
					...state.todos.slice(999),
				]
			:	state.todos
		),
	}),
};


/// COMPONENTS ///

const Jumbotron = ({
	actions,
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
						click: () => actions.create(1e3),
					}, {
						id: 'runlots', label: 'Create 10,000 rows',
						click: () => actions.create(1e4),
					}, {
						id: 'add', label: 'Append 1,000 rows',
						click: () => actions.add(1e3),
					}, {
						id: 'update', label: 'Update every 10th row',
						click: () => actions.update(10),
					}, {
						id: 'clear', label: 'Clear',
						click: () => actions.init(),
					}, {
						id: 'swaprows', label: 'Swap Rows',
						click: () => actions.swap(),
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
	actions,
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
					actions.select(id);
				}),
			}),
		]),
		node_dom('td[className=col-md-1]', null, [
			node_dom('a', {
				onclick: hook_static(() => {
					actions.remove(id);
				}),
			}, [
				node_dom('span[className=glyphicon glyphicon-remove][ariaHidden]'),
			]),
		]),
		node_dom('td[className=col-md-6]'),
	]
);

init(() => {
	const [
		{
			todos,
			selected,
		},
		actions,
	] = hook_model(model);

	return [
		node_dom('div[className=container]', null, [
			node(Jumbotron, {
				actions,
			}),
			node_dom('table[className=table table-hover table-striped test-data]', null, [
				node_dom('tbody', null, [
					node_map(Row, todos, {
						actions,
						selected,
					}),
				]),
			]),
			node_dom('span[className=preloadicon glyphicon glyphicon-remove][ariaHidden]'),
		]),
	];
});
