/** @jsx h */

import { render, component, h } from 'literaljs';
import '../../../css/bootstrap/dist/css/bootstrap.min.css';
import '../../../css/main';

import { Store } from './store';
var store = new Store();

var startTime;
var lastMeasure;
var startMeasure = function(name) {
	startTime = performance.now();
	lastMeasure = name;
};
var stopMeasure = function() {
	var last = lastMeasure;
	if (lastMeasure) {
		window.setTimeout(function() {
			lastMeasure = null;
			var stop = performance.now();
			console.log(last + ' took ' + (stop - startTime));
		}, 0);
	}
};

const App = component({
	state: {
		rows: store.data,
		selected: store.selected
	},
	methods() {
		return {
			handleClick(e) {
				const { action, id } = e.target.dataset;
				if (action && id) {
					this[action](id);
				}
			},
			add() {
				startMeasure('add');
				store.add();
				this.sync();
				stopMeasure();
			},
			remove(id) {
				startMeasure('remove');
				store.delete(id);
				this.sync();
				stopMeasure();
			},
			select(id) {
				startMeasure('select');
				store.select(id);
				this.sync();
				stopMeasure();
			},
			run() {
				startMeasure('run');
				store.run();
				this.sync();
				stopMeasure();
			},
			update() {
				startMeasure('update');
				store.update();
				this.sync();
				stopMeasure();
			},
			runLots() {
				startMeasure('runLots');
				store.runLots();
				this.sync();
				stopMeasure();
			},
			clear() {
				startMeasure('clear');
				store.clear();
				this.sync();
				stopMeasure();
			},
			swapRows() {
				startMeasure('swapRows');
				store.swapRows();
				this.sync();
				stopMeasure();
			},
			sync() {
				this.setState({
					rows: Object.freeze(store.data),
					selected: store.selected
				});
			}
		};
	},
	render() {
		return (
			<div class="container">
				<div class="jumbotron">
					<div class="row">
						<div class="col-md-6">
							<h1>LiteralJS (non-keyed)</h1>
						</div>
						<div class="col-md-6">
							<div class="row">
								<div class="col-sm-6 smallpad">
									<button
										type="button"
										class="btn btn-primary btn-block"
										id="run"
										events={{ click: this.run }}
									>
										Create 1,000 rows
									</button>
								</div>
								<div class="col-sm-6 smallpad">
									<button
										type="button"
										class="btn btn-primary btn-block"
										id="runlots"
										events={{ click: this.runLots }}
									>
										Create 10,000 rows
									</button>
								</div>
								<div class="col-sm-6 smallpad">
									<button
										type="button"
										class="btn btn-primary btn-block"
										id="add"
										events={{ click: this.add }}
									>
										Append 1,000 rows
									</button>
								</div>
								<div class="col-sm-6 smallpad">
									<button
										type="button"
										class="btn btn-primary btn-block"
										id="update"
										events={{ click: this.update }}
									>
										Update every 10th row
									</button>
								</div>
								<div class="col-sm-6 smallpad">
									<button
										type="button"
										class="btn btn-primary btn-block"
										id="clear"
										events={{ click: this.clear }}
									>
										Clear
									</button>
								</div>
								<div class="col-sm-6 smallpad">
									<button
										type="button"
										class="btn btn-primary btn-block"
										id="swaprows"
										events={{ click: this.swapRows }}
									>
										Swap Rows
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<table
					class="table table-hover table-striped test-data"
					events={{ click: this.handleClick }}
				>
					<tbody>
						{this.getState().rows.map(item => (
							<tr
								class={
									item.id == this.getState().selected
										? 'danger'
										: ''
								}
							>
								<td class="col-md-1">{item.id}</td>
								<td class="col-md-4">
									<a data-action="select" data-id={item.id}>
										{item.label}
									</a>
								</td>
								<td class="col-md-1">
									<a>
										<span
											class="glyphicon glyphicon-remove"
											aria-hidden="true"
											data-action="remove"
											data-id={item.id}
										/>
									</a>
								</td>
								<td class="col-md-6" />
							</tr>
						))}
					</tbody>
				</table>
				<span
					class="preloadicon glyphicon glyphicon-remove"
					aria-hidden="true"
				/>
			</div>
		);
	}
});

render(App, 'root', {});
