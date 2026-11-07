import { MapItems, type JsxRenderable } from '@ecopages/jsx';
import { RadiantElement, customElement, onEvent, signal } from '@ecopages/radiant';
import type { WritableSignal } from '@ecopages/signals';
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

	#selected: Row | undefined;

	@onEvent({ ref: 'run', type: 'click' })
	createRows() {
		this.#selected = undefined;
		this.rows.set(buildRows(1_000));
	}

	@onEvent({ ref: 'runlots', type: 'click' })
	createManyRows() {
		this.#selected = undefined;
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
		this.#selected = undefined;
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

	@onEvent({ ref: 'rows', type: 'click' })
	onRowClick(event: MouseEvent) {
		const target = event.target as Element;
		const row = (target.closest('tr') as (HTMLTableRowElement & { row?: Row }) | null)?.row;
		if (!row) return;
		if (target.closest('.remove')) this.removeRow(row);
		else if (target.closest('.lbl')) this.selectRow(row);
	}

	selectRow(row: Row) {
		if (row === this.#selected) return;
		this.#selected?.cls.set('');
		row.cls.set('danger');
		this.#selected = row;
	}

	removeRow(row: Row) {
		if (row === this.#selected) this.#selected = undefined;
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
					<tbody data-ref="rows">
						<MapItems each={this.rows}>
							{(row) => (
								<tr prop:row={row} attr:class={row.cls}>
									<td class="col-md-1">{row.id}</td>
									<td class="col-md-4">
										<a class="lbl">{row.label}</a>
									</td>
									<td class="col-md-1">
										<a class="remove">
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
