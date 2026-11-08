import { MapItems, type JsxRenderable } from '@ecopages/jsx';
import { RadiantElement, customElement, onEvent, signal } from '@ecopages/radiant';
import { computed, type WritableSignal } from '@ecopages/signals';
import { buildRows, type Row } from './rows';

type ButtonProps = { id: string; children: JsxRenderable };

const Button = ({ id, children }: ButtonProps) => (
	<div class="col-sm-6 smallpad">
		<button id={id} data-ref={id} type="button" class="btn btn-primary btn-block">
			{children}
		</button>
	</div>
);

@customElement('benchmark-app')
export class BenchmarkApp extends RadiantElement {
	@signal({ initial: [] as Row[] }) rows!: WritableSignal<Row[]>;
	@signal({ initial: 0 }) selectedId!: WritableSignal<number>;

	@onEvent({ ref: 'run', type: 'click' })
	createRows() {
		this.rows.set(buildRows(1_000));
	}

	@onEvent({ ref: 'runlots', type: 'click' })
	createManyRows() {
		this.rows.set(buildRows(10_000));
	}

	@onEvent({ ref: 'add', type: 'click' })
	appendRows() {
		this.rows.set([...this.rows.get(), ...buildRows(1_000)]);
	}

	@onEvent({ ref: 'update', type: 'click' })
	updateEveryTenthRow() {
		const rows = this.rows.get();
		for (let index = 0; index < rows.length; index += 10) rows[index].label.set(`${rows[index].label.get()} !!!`);
	}

	@onEvent({ ref: 'clear', type: 'click' })
	clearRows() {
		this.rows.set([]);
	}

	@onEvent({ ref: 'swaprows', type: 'click' })
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
		return (
			<div class="container">
				<div class="jumbotron">
					<div class="row">
						<div class="col-md-6">
							<h1>Radiant + Ecopages JSX</h1>
						</div>
						<div class="col-md-6">
							<div class="row">
								<Button id="run">
									Create 1,000 rows
								</Button>
								<Button id="runlots">
									Create 10,000 rows
								</Button>
								<Button id="add">
									Append 1,000 rows
								</Button>
								<Button id="update">
									Update every 10th row
								</Button>
								<Button id="clear">
									Clear
								</Button>
								<Button id="swaprows">
									Swap Rows
								</Button>
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
