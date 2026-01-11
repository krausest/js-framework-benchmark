// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, render, state } from "reflex-dom"

// ----------------------------------------------------------------------------- DATA HELPERS

const A = [
	"pretty", "large", "big", "small", "tall", "short", "long", "handsome",
	"plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful",
	"mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
	"cheap", "expensive", "fancy"
];
const C = [
	"red", "yellow", "blue", "green", "pink", "brown", "purple", "brown",
	"white", "black", "orange"
];
const N = [
	"table", "chair", "house", "bbq", "desk", "car", "pony", "cookie",
	"sandwich", "burger", "pizza", "mouse", "keyboard"
];

const _pick = array => array[Math.floor(Math.random() * array.length)]

// ----------------------------------------------------------------------------- STRUCT & STATES

interface IDataItem
{
	id		:number
	label	:string
}

const $data = state<IDataItem[]>([])
const $selected = state<number>( null )

// ----------------------------------------------------------------------------- DATA ACTIONS

const run = () => $data.set( buildData(1000) )
const runLots = () => $data.set( buildData(10000) )
const add = () => $data.set( d => [...d, ...buildData(1000)] )
const update = () => $data.set( d => {
	for ( let i = 0, len = d.length; i < len; i += 10 )
		d[i].label += ' !!!';
	return [...d]
})
const clear = () => $data.set([])
const swapRows = () => $data.set( d => {
	if ( d.length > 998 ) {
		let tmp = d[1];
		d[1] = d[998];
		d[998] = tmp;
		return [...d];
	}
	return d
})
const remove = id => $data.set(d => {
	const idx = d.findIndex( d => d.id === id );
	return [ ...d.slice(0, idx), ...d.slice(idx + 1) ];
})
const toggleSelection = ( id:number ) => {
	$selected.set( $selected.value === id ? null : id )
}

// ----------------------------------------------------------------------------- BUILD DATA

let _counter = 1;
const buildData = (count:number) => {
	// eslint-disable-next-line unicorn/no-new-array
	const data = new Array(count);
	for ( let i = 0; i < count; ++i ) {
		data[i] = {
			id: _counter++,
			label: `${_pick(A)} ${_pick(C)} ${_pick(N)}`,
		};
	}
	return data;
};

// ----------------------------------------------------------------------------- BUTTON

const Button = ({ id, onClick, title }) =>
	<div class="col-sm-6 smallpad">
		<button
			type="button"
			class="btn btn-primary btn-block"
			id={ id } onClick={ onClick }
			children={[ title ]}
		/>
	</div>

// ----------------------------------------------------------------------------- ROW

const Row = ( props ) =>
	<tr class={ props.selected ? "danger" : "" }>
		<td class="col-md-1">{ props.id }</td>
		<td class="col-md-4">
			<a onClick={ () => toggleSelection( props.id ) }>
				{ props.label }
			</a>
		</td>
		<td class="col-md-1">
			<a onClick={ () => remove( props.id ) }>
				<span class="glyphicon glyphicon-remove" aria-hidden="true" />
			</a>
		</td>
		<td class="col-md-6" />
	</tr>

Row.shouldUpdate = (newProps, oldProps) => (
	oldProps.selected !== newProps.selected
	|| oldProps.label !== newProps.label
)

// ----------------------------------------------------------------------------- JUMBOTRON

const Jumbotron = () =>
	<div class="jumbotron">
		<div class="row">
			<div class="col-md-6">
				<h1>Reflex</h1>
			</div>
			<div class="col-md-6">
				<div class="row">
					<Button id="run" title="Create 1,000 rows" onClick={ run } />
					<Button id="runlots" title="Create 10,000 rows" onClick={ runLots } />
					<Button id="add" title="Append 1,000 rows" onClick={ add } />
					<Button id="update" title="Update every 10th row" onClick={ update } />
					<Button id="clear" title="Clear" onClick={ clear } />
					<Button id="swaprows" title="Swap Rows" onClick={ swapRows } />
				</div>
			</div>
		</div>
	</div>

// ----------------------------------------------------------------------------- APP

function App () {
	return () => <div class="container">
		<Jumbotron />
		<table class="table table-hover table-striped test-data">
			<tbody>
				{$data.value.map( item =>
					<Row
						key={ item.id }
						id={ item.id }
						label={ item.label }
						selected={ $selected.value === item.id }
					/>
				)}
			</tbody>
		</table>
		<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
	</div>
}

// eslint-disable-next-line no-undef,unicorn/prefer-query-selector
render(<App />, document.getElementById("main"))
