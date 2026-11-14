import { MapItems } from '@ecopages/jsx';
import { RadiantElement, bound, customElement, signal } from '@ecopages/radiant';
import { computed, type WritableSignal } from '@ecopages/signals';
import { buildRows, type Row } from './rows';

@customElement('benchmark-app')
export class BenchmarkApp extends RadiantElement {
	@signal({ initial: [] as Row[] }) rows!: WritableSignal<Row[]>;
	@signal({ initial: 0 }) selectedId!: WritableSignal<number>;

	@bound
	createRows() {
		this.rows.set(buildRows(1_000));
	}

	@bound
	createManyRows() {
		this.rows.set(buildRows(10_000));
	}

	@bound
	appendRows() {
		this.rows.set([...this.rows.get(), ...buildRows(1_000)]);
	}

	@bound
	updateEveryTenthRow() {
		const rows = this.rows.get();
		for (let index = 0; index < rows.length; index += 10) rows[index].label.set(`${rows[index].label.get()} !!!`);
	}

	@bound
	clearRows() {
		this.rows.set([]);
	}

	@bound
	swapRows() {
		const rows = this.rows.get();
		if (rows.length <= 998) return;
		const next = rows.slice();
		[next[1], next[998]] = [next[998], next[1]];
		this.rows.set(next);
	}

	selectRow(row: Row) {
		this.selectedId.set(row.id);
	}

	removeRow(row: Row) {
		this.rows.set(this.rows.get().filter((candidate) => candidate !== row));
	}

	override render() {
		const buttons = [
			{ id: 'run', label: 'Create 1,000 rows', action: this.createRows },
			{ id: 'runlots', label: 'Create 10,000 rows', action: this.createManyRows },
			{ id: 'add', label: 'Append 1,000 rows', action: this.appendRows },
			{ id: 'update', label: 'Update every 10th row', action: this.updateEveryTenthRow },
			{ id: 'clear', label: 'Clear', action: this.clearRows },
			{ id: 'swaprows', label: 'Swap Rows', action: this.swapRows },
		];

		return (
			<div class="container">
				<div class="jumbotron">
					<div class="row">
						<div class="col-md-6">
							<h1>Radiant + Ecopages JSX</h1>
						</div>
						<div class="col-md-6">
							<div class="row">
								{buttons.map(({ id, label, action }) => (
									<div class="col-sm-6 smallpad">
										<button id={id} type="button" class="btn btn-primary btn-block" on:click={action}>
											{label}
										</button>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<table class="table table-hover table-striped test-data">
					<tbody>
						<MapItems each={this.rows}>
							{(row) => (
								<tr classes={computed(() => (this.selectedId.get() === row.id ? 'danger' : ''))}>
									<td class="col-md-1">{row.id}</td>
									<td class="col-md-4">
										<a on:click={() => this.selectRow(row)}>{row.label}</a>
									</td>
									<td class="col-md-1">
										<a on:click={() => this.removeRow(row)}>
											<span class="glyphicon glyphicon-remove" aria-hidden="true" />
										</a>
									</td>
									<td class="col-md-6" />
								</tr>
							)}
						</MapItems>
					</tbody>
				</table>
				<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
			</div>
		);
	}
}
