/** @jsx h */

import { render, component, h } from 'literaljs';

import { Store } from './store';

const App = component({
	state: { store: new Store() },
	methods() {
		const { store } = this.getState();
		return {
			run() {
				store.run();
				this.setState({ store });
			},
			add() {
				store.add();
				this.setState({ store });
			},
			update() {
				store.update();
				this.setState({ store });
			},
			select(id) {
				store.select(id);
				this.setState({ store });
			},
			delete(id) {
				store.delete(id);
				this.setState({ store });
			},
			runLots() {
				store.runLots();
				this.setState({ store });
			},
			clear() {
				store.clear();
				this.setState({ store });
			},
			swapRows() {
				store.swapRows();
				this.setState({ store });
			}
		};
	},
	render() {
		const { store } = this.state;
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
							<tr
								class={
									item.id === store.selected ? 'danger' : ''
								}
							>
								<td class="col-md-1">{item.id}</td>
								<td class="col-md-4">
									<a
										events={{
											click: () => this.select(item.id)
										}}
									>
										{item.label}
									</a>
								</td>
								<td class="col-md-1">
									<a>
										<span
											class="glyphicon glyphicon-remove"
											aria-hidden="true"
											events={{
												click: () =>
													this.delete(item.id)
											}}
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
