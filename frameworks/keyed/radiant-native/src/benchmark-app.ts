import { RadiantElement, customElement, onEvent, query } from '@ecopages/radiant';
import { buildRows, type Row } from './rows';

type RowNode = HTMLTableRowElement & { row: Row };

const rowTemplate = document.createElement('template');
rowTemplate.innerHTML =
	'<tr><td class="col-md-1"> </td><td class="col-md-4"><a class="lbl"> </a></td><td class="col-md-1"><a class="remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>';

@customElement('benchmark-app')
export class BenchmarkApp extends RadiantElement {
	@query({ ref: 'rows', cache: true }) tbody!: HTMLTableSectionElement | null;

	#rows: Row[] = [];
	#nodes = new Map<Row, RowNode>();
	#selected: RowNode | undefined;

	@onEvent({ ref: 'run', type: 'click' })
	createRows() {
		this.#replace(buildRows(1_000));
	}

	@onEvent({ ref: 'runlots', type: 'click' })
	createManyRows() {
		this.#replace(buildRows(10_000));
	}

	@onEvent({ ref: 'add', type: 'click' })
	appendRows() {
		const added = buildRows(1_000);
		const fragment = document.createDocumentFragment();
		for (const row of added) fragment.append(this.#createNode(row));
		this.tbody?.append(fragment);
		this.#rows = [...this.#rows, ...added];
	}

	@onEvent({ ref: 'update', type: 'click' })
	updateEveryTenthRow() {
		for (let index = 0; index < this.#rows.length; index += 10) {
			const row = this.#rows[index];
			row.label += ' !!!';
			this.#labelOf(this.#nodes.get(row)!).data = row.label;
		}
	}

	@onEvent({ ref: 'clear', type: 'click' })
	clearRows() {
		this.#replace([]);
	}

	@onEvent({ ref: 'swaprows', type: 'click' })
	swapRows() {
		if (this.#rows.length <= 998) return;
		const next = this.#rows.slice();
		[next[1], next[998]] = [next[998], next[1]];
		this.#reorder(next);
	}

	@onEvent({ ref: 'rows', type: 'click' })
	onRowClick(event: MouseEvent) {
		const target = event.target as Element;
		const node = target.closest('tr') as RowNode | null;
		if (!node) return;
		if (target.closest('.remove')) this.#removeRow(node);
		else if (target.closest('.lbl')) this.#selectRow(node);
	}

	#selectRow(node: RowNode) {
		if (node === this.#selected) return;
		if (this.#selected) this.#selected.className = '';
		node.className = 'danger';
		this.#selected = node;
	}

	#removeRow(node: RowNode) {
		if (node === this.#selected) this.#selected = undefined;
		node.remove();
		this.#nodes.delete(node.row);
		this.#rows = this.#rows.filter((row) => row !== node.row);
	}

	#replace(rows: Row[]) {
		const tbody = this.tbody;
		if (!tbody) return;
		tbody.textContent = '';
		this.#nodes.clear();
		this.#selected = undefined;
		const fragment = document.createDocumentFragment();
		for (const row of rows) fragment.append(this.#createNode(row));
		tbody.append(fragment);
		this.#rows = rows;
	}

	#reorder(rows: Row[]) {
		const tbody = this.tbody;
		if (!tbody) return;
		const oldIndex = new Map(this.#rows.map((row, index) => [row, index]));
		const keep = longestIncreasingRun(rows.map((row) => oldIndex.get(row) ?? -1));
		let next: Node | null = null;

		for (let index = rows.length - 1; index >= 0; index -= 1) {
			const node = this.#nodes.get(rows[index])!;
			if (!keep.has(index)) tbody.insertBefore(node, next);
			next = node;
		}

		this.#rows = rows;
	}

	#createNode(row: Row): RowNode {
		const node = rowTemplate.content.firstChild!.cloneNode(true) as RowNode;
		node.row = row;
		(node.firstChild!.firstChild as Text).data = String(row.id);
		this.#labelOf(node).data = row.label;
		this.#nodes.set(row, node);
		return node;
	}

	#labelOf(node: RowNode): Text {
		return node.firstChild!.nextSibling!.firstChild!.firstChild as Text;
	}
}

function longestIncreasingRun(values: readonly number[]): Set<number> {
	const tails: number[] = [];
	const previous = new Array<number>(values.length);

	for (let index = 0; index < values.length; index += 1) {
		const value = values[index];
		if (value < 0) continue;
		let low = 0;
		let high = tails.length;
		while (low < high) {
			const middle = (low + high) >> 1;
			if (values[tails[middle]] < value) low = middle + 1;
			else high = middle;
		}
		previous[index] = low > 0 ? tails[low - 1] : -1;
		tails[low] = index;
	}

	const keep = new Set<number>();
	for (let index = tails.length ? tails[tails.length - 1] : -1; index >= 0; index = previous[index]) keep.add(index);
	return keep;
}
