'use strict';

import TSERS from '@tsers/core';
import ReactDOM from '@tsers/react';
import Model from '@tsers/model';
import {Observable} from 'rx';
import {Store} from './store';

var store = new Store();

var c = {};

function cache(key, render) {
  var value = c[key];

  if (!c[key]) {
    c[key] = value = render();
  }

  return value;
}

function main(signals) {
	const {DOM, model$, mux} = signals;
	const {h} = DOM;

	const vdom$ = DOM.prepare(model$.map(state =>
	/* {
		let rows = state.items.map(item =>
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
		);
		return <div className='container'>
			<div className='jumbotron'>
				<div className='row'>
					<div className='col-md-8'>
						<h1>TSERS v1.0.0</h1>
					</div>
					<div className='col-md-4'>
						<button type='button' className='btn btn-primary btn-block' id='add'>Add 1000 rows</button>
						<button type='button' className='btn btn-primary btn-block' id='run'>Create 1000 rows</button>
						<button type='button' className='btn btn-primary btn-block' id='update'>Update every 10th row</button>
						<button type='button' className='btn btn-primary btn-block' id='hideall'>HideAll</button>
						<button type='button' className='btn btn-primary btn-block' id='showall'>ShowAll</button>
						<button type='button' className='btn btn-primary btn-block' id='runlots'>Create lots of rows</button>
						<button type='button' className='btn btn-primary btn-block' id='clear'>Clear</button>
						<button type='button' className='btn btn-primary btn-block' id='swaprows'>Swap Rows</button>
						<h3 id='duration'><span className='glyphicon glyphicon-remove' aria-hidden='true'></span>&nbsp;</h3>
					</div>
				</div>
			</div>
			<table className='table table-hover table-striped test-data'>
				<tbody>
				</tbody>
			</table>
		</div>;
	} */
	{
		let rows = state.items.map((item) =>
			cache(item.id + ':' + item.label + ':' + (item.id === state.selected), () =>
				h(
					'tr',
					{ id: item.id, className: state.selected === item.id ? 'danger' : '' },
					[
						h(
							'td',
							{ className: 'col-md-1' },
							item.id
						),
						h(
							'td',
							{ className: 'col-md-4' },
							h(
								'a',
								{ className: 'select' },
								item.label
							)
						),
						h(
							'td',
							{ className: 'col-md-1' },
							h(
								'a',
								{ className: 'remove' },
								h('span', { className: 'glyphicon glyphicon-remove remove'})
							)
						),
						h('td', { className: 'col-md-6' })
					]
				)
			)
		);

		return h(
			'div',
			{ className: 'container' },
			[
				h(
					'div',
					{ className: 'jumbotron' },
					h(
						'div',
						{ className: 'row' },
						[
							h(
								'div',
								{ className: 'col-md-6' },
								h(
									'h1',
									null,
									'TSERS v1.0.0'
								)
							),
							h(
								'div',
								{ className: 'col-md-6' },
								[
									h(
										'div',
										{ className: 'row' },
										[
											h(
												'div',
												{ className: 'col-sm-6 smallpad' },
												[
													h(
														'button',
														{ type: 'button', className: 'btn btn-primary btn-block', id: 'run' },
														'Create 1,000 rows'
													)
												]
											),
											h(
												'div',
												{ className: 'col-sm-6 smallpad' },
												[
													h(
														'button',
														{ type: 'button', className: 'btn btn-primary btn-block', id: 'runlots' },
														'Create 10,000 rows'
													)
												]
											),
											h(
												'div',
												{ className: 'col-sm-6 smallpad' },
												[
													h(
														'button',
														{ type: 'button', className: 'btn btn-primary btn-block', id: 'add' },
														'Append 1,000 rows'
													)
												]
											),
											h(
												'div',
												{ className: 'col-sm-6 smallpad' },
												[
													h(
														'button',
														{ type: 'button', className: 'btn btn-primary btn-block', id: 'update' },
														'Update every 10th row'
													)
												]
											),
											h(
												'div',
												{ className: 'col-sm-6 smallpad' },
												[
													h(
														'button',
														{ type: 'button', className: 'btn btn-primary btn-block', id: 'clear' },
														'Clear'
													)
												]
											),
											h(
												'div',
												{ className: 'col-sm-6 smallpad' },
												[
													h(
														'button',
														{ type: 'button', className: 'btn btn-primary btn-block', id: 'swaprows' },
														'Swap Rows'
													)
												]
											)
										]
									)
								]
							)
						]
					)
				),
				h(
					'table',
					{ className: 'table table-hover table-striped test-data' },
					h('tbody', rows)
				),
				h('span', { className: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': 'true' })
			]
		);
	}
	));

	const addMod$ = DOM.events(vdom$, '#add', 'click').map(() => () => {
		store.add();
		return {items: store.data, selected: store.selected};
	});

	const runMod$ = DOM.events(vdom$, '#run', 'click').map(() => () => {
		store.run();
		return {items: store.data, selected: store.selected};
	});

	const updateMod$ = DOM.events(vdom$, '#update', 'click').map(() => () => {
		store.update();
		return {items: store.data, selected: store.selected};
	});

	const runLotsMod$ = DOM.events(vdom$, '#runlots', 'click').map(() => () => {
		store.runLots();
		return {items: store.data, selected: store.selected};
	});

	const clearMod$ = DOM.events(vdom$, '#clear', 'click').map(() => () => {
		store.clear();
		return {items: store.data, selected: store.selected};
	});

	const swapRowsMod$ = DOM.events(vdom$, '#swaprows', 'click').map(() => () => {
		store.swapRows();
		return {items: store.data, selected: store.selected};
	});

	const selectMod$ = DOM.events(vdom$, '.select', 'click').map((e) => () => {
		let el = e.target;
		while(el && !el.id) {
			el = el.parentNode;
		}

		store.select(parseInt(el.id));

		return {items: store.data, selected: store.selected};
	});

	const removeMod$ = DOM.events(vdom$, '.remove', 'click').map((e) => () => {
		let el = e.target;
		while(el && !el.id) {
			el = el.parentNode;
		}

		store.delete(parseInt(el.id));

		return {items: store.data, selected: store.selected};
	});

	return mux({
		DOM: vdom$,
		model$: model$.mod(Observable.merge(addMod$, runMod$, updateMod$, runLotsMod$, clearMod$, swapRowsMod$, selectMod$, removeMod$))
	});
};

TSERS(main, {
	DOM: ReactDOM('#main'),
	model$: Model({items: store.data, selected: store.selected})
});