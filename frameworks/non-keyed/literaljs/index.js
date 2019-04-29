/** @jsx h */

import { render, component, h } from 'literaljs';
import '../../../css/bootstrap/dist/css/bootstrap.min.css';
import '../../../css/main';

import { Store } from './store';

const Row = component({
	shouldUpdate(oldProps, oldState) {
		return (
			oldProps.label !== this.props.label ||
			oldProps.styleClass !== this.props.styleClass
		);
	},
	render() {
		const { id, label, selectRow, deleteRow, styleClass } = this.props;
		return (
			<tr class={styleClass}>
				<td class="col-md-1">{id}</td>
				<td class="col-md-4">
					<a events={{ click: () => selectRow(id) }}>{label}</a>
				</td>
				<td class="col-md-1">
					<a>
						<span
							class="glyphicon glyphicon-remove"
							aria-hidden="true"
							events={{ click: () => deleteRow(id) }}
						/>
					</a>
				</td>
			</tr>
		);
	}
});

const App = component({
	methods() {
		const { store } = this.getStore();
		return {
			run() {
				store.run();
				this.setStore({ store });
			},
			add() {
				store.add();
				this.setStore({ store });
			},
			update() {
				store.update();
				this.setStore({ store });
			},
			select(id) {
				store.select(id);
				this.setStore({ store });
			},
			delete(id) {
				store.delete(id);
				this.setStore({ store });
			},
			runLots() {
				store.runLots();
				this.setStore({ store });
			},
			clear() {
				store.clear();
				this.setStore({ store });
			},
			swapRows() {
				store.swapRows();
				this.setStore({ store });
			}
		};
	},
	render() {
		const { store } = this.getStore();
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
				<table class="table table-hover table-striped test-data">
					<tbody>
						{store.data.map(item => (
							<Row
								props={{
									id: item.id,
									label: item.label,
									deleteRow: this.delete,
									selectRow: this.select,
									styleClass:
										item.id === store.selected
											? 'danger'
											: ''
								}}
							/>
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

render(App, 'root', { store: new Store() });
