'use strict';

/** @jsx glasgow */

import { Store } from './store.es6'
import glasgow from 'glasgow'

function selectRow(props) {
	props.store.select(props.id);
}

function deleteRow(props) {
	props.store.delete(props.id);
}

function Row({ d, id, styleClass }) {
	return (
		<tr className={styleClass}>
			<td className="col-md-1">{''+id}</td>
			<td className="col-md-4">
				<a onclick={selectRow}>{d.label}</a>
			</td>
			<td className="col-md-1">
				<a onclick={deleteRow}>
					<span className="glyphicon glyphicon-remove" aria-hidden="true"/>
				</a>
			</td>
			<td className="col-md-6"/>
		</tr>
	)
}

function createRows(store) {
	const rows = [];
	const data = store.data;
	const selected = store.selected;

	for (let i = 0; i < data.length; i++) {
		const d = data[i];
		const id = d.id;

		rows.push(
			<Row
				store={store}
				styleClass={id === selected ? 'danger' : null}
				key={id}
				d={d}
				id={id}
				selected={selected}
			/>
		);
	}

	return <tbody>{rows}</tbody>;
}

function bind(obj,name) {
	let func = obj[name];
	return function(...args) {
		return func.apply(obj, args);
	}
}

export function Controller(props) {

	return <div className="container">
		<div className="jumbotron">
			<div className="row">
				<div className="col-md-6">
					<h1>Glasgow - keyed</h1>
				</div>
				<div className="col-md-6">
					<div className="row">
						<div className="col-sm-6 smallpad">
							<button type="button" className="btn btn-primary btn-block" id="run" onclick={bind(store,'run')}>Create 1,000
								rows
							</button>
						</div>
						<div className="col-sm-6 smallpad">
							<button type="button" className="btn btn-primary btn-block" id="runlots" onclick={bind(store,'runLots')}>Create
								10,000 rows
							</button>
						</div>
						<div className="col-sm-6 smallpad">
							<button type="button" className="btn btn-primary btn-block" id="add" onclick={bind(store,'add')}>Append 1,000
								rows
							</button>
						</div>
						<div className="col-sm-6 smallpad">
							<button type="button" className="btn btn-primary btn-block" id="update" onclick={bind(store,'update')}>Update
								every 10th row
							</button>
						</div>
						<div className="col-sm-6 smallpad">
							<button type="button" className="btn btn-primary btn-block" id="clear" onclick={bind(store,'clear')}>Clear
							</button>
						</div>
						<div className="col-sm-6 smallpad">
							<button type="button" className="btn btn-primary btn-block" id="swaprows" onclick={bind(store,'swapRows')}>Swap
								Rows
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<table className="table table-hover table-striped test-data">
			{createRows(store)}
		</table>
		<span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"/>
	</div>
}


const store = new Store();
glasgow.setDebug(0);
glasgow.mount(document.getElementById("main"), <Controller store={store}/>);

