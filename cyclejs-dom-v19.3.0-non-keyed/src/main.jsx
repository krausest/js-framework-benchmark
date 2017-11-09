'use strict';

import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import {html} from 'snabbdom-jsx';

let id = 1;

function _random(max) {
	return Math.round(Math.random()*1000)%max;
};

let adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
let colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
let nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

function buildData(count = 1000) {
	var data = [];
	
	for(var i = 0; i < count; i++) {
		data.push({
			id: id++,
			label: adjectives[_random(adjectives.length)] + ' ' + colours[_random(colours.length)] + ' ' + nouns[_random(nouns.length)]
		});
	}
	
	return data;
};

const Operations = {
	Run: state => ({items: buildData(), selected: undefined}),
	Update: state => ({items: state.items.map((item, idx) => (idx%10 === 0) ? ({id:item.id, label: item.label+' !!!'}) : item), selected: state.selected}),
	Add: state => ({items: state.items.concat(buildData(1000)), selected: state.selected}),
	SelectItem: item => state => ({items: state.items, selected: item}),
	RemoveItem: id => state => ({items: state.items.filter(item => item.id !== id), selected: state.selected}),
	RunLots: state => ({items: buildData(10000), selected: null}),
	Clear: state => ({items: [], selected: null}),
	SwapRows: state => {
		let d = state.items.splice(0);
		if(d.length > 10) {
			var a = d[4];
			d[4] = d[9];
			d[9] = a;
		}
		return {items: d, selected: state.selected};
	}
};

function intent(DOMSource) {
	return xs.merge(
		DOMSource.select('#run').events('click').map(evt => Operations.Run),
		DOMSource.select('#update').events('click').map(evt => Operations.Update),
		DOMSource.select('#add').events('click').map(evt => Operations.Add),
		DOMSource.select('#runlots').events('click').map(evt => Operations.RunLots),
		DOMSource.select('#clear').events('click').map(evt => Operations.Clear),
		DOMSource.select('#swaprows').events('click').map(evt => Operations.SwapRows),
		DOMSource.select('.remove').events('click').map(evt => {
			evt.preventDefault();
			evt.stopPropagation();
			
			let el = evt.target;
			while(el && !el.id) {
				el = el.parentNode;
			}
			
			return Operations.RemoveItem(parseInt(el.id));
		}),
		DOMSource.select('.select').events('click').map(evt => {
			evt.preventDefault();
			evt.stopPropagation();
			
			let el = evt.target;
			while(el && !el.id) {
				el = el.parentNode;
			}
			
			return Operations.SelectItem(parseInt(el.id));
		})
	);
};

function model(operation$) {
	return operation$.fold((state, operation) => {
		return operation(state);
	}, {items:[]});
}

function view(state$) {
	return state$.map(state =>
		<div className='container'>
			<div className='jumbotron'>
				<div className='row'>
					<div className='col-md-6'>
						<h1>Cycle.js dom@19.3.0</h1>
					</div>
					<div className="col-md-6">
						<div className="row">
							<div className="col-sm-6 smallpad">
								<button type='button' className='btn btn-primary btn-block' id='run'>Create 1,000 rows</button>
							</div>
							<div className="col-sm-6 smallpad">
								<button type='button' className='btn btn-primary btn-block' id='runlots'>Create 10,000 rows</button>
							</div>
							<div className="col-sm-6 smallpad">
								<button type='button' className='btn btn-primary btn-block' id='add'>Append 1,000 rows</button>
							</div>
							<div className="col-sm-6 smallpad">
								<button type='button' className='btn btn-primary btn-block' id='update'>Update every 10th row</button>
							</div>
							<div className="col-sm-6 smallpad">
								<button type='button' className='btn btn-primary btn-block' id='clear'>Clear</button>
							</div>
							<div className="col-sm-6 smallpad">
								<button type='button' className='btn btn-primary btn-block' id='swaprows'>Swap Rows</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<table className='table table-hover table-striped test-data'>
				<tbody>
				{
					state.items.map(item =>
						<tr id={item.id} className={state.selected === item.id ? 'danger' : ''}>
							<td className='col-md-1'>{item.id}</td>
							<td className='col-md-4'>
								<a className='select'>{item.label}</a>
							</td>
							<td className='col-md-1'>
								<a className='remove'><span className='glyphicon glyphicon-remove'></span></a>
							</td>
							<td className='col-md-6'/>
						</tr>
					)
				}
				</tbody>
			</table>
			<span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
		</div>
	);
}

function main(sources) {
	const state$ = model(intent(sources.DOM));
	
	return {
		DOM: view(state$)
	}
};

var drivers = {
	DOM: makeDOMDriver('#main')
};

run(main, drivers);