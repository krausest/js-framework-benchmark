import { RadiantElement } from '@ecopages/radiant';
import { Model, buttons } from './model.js';

const rowTemplate = document.createElement('template');
rowTemplate.innerHTML =
	'<tr><td class="col-md-1"> </td><td class="col-md-4"><a class="lbl"> </a></td><td class="col-md-1"><a class="remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>';

/**
 * Radiant element that renders the table with direct DOM updates. Rows live in a map from id to row state, so an
 * action touches only the rows it changes: select updates two class names, update writes changed labels, swap and
 * remove move or drop single rows, and clear and create work on the whole body at once.
 */
class Benchmark extends RadiantElement {
	model = new Model(() => this.refresh());
	rowsById = new Map();
	selectedRow = null;

	connectedCallback() {
		super.connectedCallback();
		this.innerHTML = `<div class="container"><div class="jumbotron"><div class="row"><div class="col-md-6"><h1>Radiant native DOM</h1></div><div class="col-md-6"><div class="row">${buttons.map(([id, label]) => `<div class="col-sm-6 smallpad"><button id="${id}" type="button" class="btn btn-primary btn-block">${label}</button></div>`).join('')}</div></div></div></div><table class="table table-hover table-striped test-data"><tbody></tbody></table><span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span></div>`;
		for (const [id] of buttons) this.querySelector(`#${id}`).addEventListener('click', () => this.model[id]());
		this.tbody = this.querySelector('tbody');
		this.tbody.addEventListener('click', (event) => {
			const node = event.target.closest('tr');
			if (!node) return;
			if (event.target.closest('.remove')) this.model.remove(node.rowId);
			else if (event.target.closest('.lbl')) this.model.select(node.rowId);
		});
	}

	createRow(row) {
		const node = rowTemplate.content.firstChild.cloneNode(true);
		const idCell = node.firstChild;
		const label = idCell.nextSibling.firstChild;
		node.rowId = row.id;
		idCell.firstChild.data = row.id;
		label.firstChild.data = row.label;
		const state = { label: row.label, labelText: label.firstChild, node };
		this.rowsById.set(row.id, state);
		return state;
	}

	refresh() {
		const { rows, selected } = this.model;

		if (rows.length === 0) {
			this.tbody.textContent = '';
			this.rowsById.clear();
			this.selectedRow = null;
			return;
		}

		if (this.rowsById.size === 0) {
			const fragment = document.createDocumentFragment();
			for (const row of rows) fragment.append(this.createRow(row).node);
			this.tbody.append(fragment);
		} else {
			this.reconcile(rows);
		}

		const selectedRow = this.rowsById.get(selected)?.node ?? null;
		if (selectedRow !== this.selectedRow) {
			if (this.selectedRow) this.selectedRow.className = '';
			if (selectedRow) selectedRow.className = 'danger';
			this.selectedRow = selectedRow;
		}
	}

	/**
	 * Keyed reconciliation: drops removed rows, then keeps the longest run of rows that are already in order and moves
	 * only the others, so a swap moves two rows and a removal moves none.
	 */
	reconcile(rows) {
		const nextIds = new Set(rows.map((row) => row.id));
		for (const [id, state] of this.rowsById) {
			if (nextIds.has(id)) continue;
			state.node.remove();
			this.rowsById.delete(id);
		}

		const oldIndex = new Map();
		let index = 0;
		for (let node = this.tbody.firstChild; node; node = node.nextSibling) oldIndex.set(node.rowId, index++);

		const states = new Array(rows.length);
		const sources = new Array(rows.length);
		for (let i = 0; i < rows.length; i += 1) {
			const row = rows[i];
			let state = this.rowsById.get(row.id);
			if (!state) {
				state = this.createRow(row);
				sources[i] = -1;
			} else {
				sources[i] = oldIndex.get(row.id);
				if (state.label !== row.label) {
					state.label = row.label;
					state.labelText.data = row.label;
				}
			}
			states[i] = state;
		}

		const keep = longestIncreasingRun(sources);
		let next = null;
		for (let i = rows.length - 1; i >= 0; i -= 1) {
			const node = states[i].node;
			if (!keep.has(i) || node.parentNode !== this.tbody) this.tbody.insertBefore(node, next);
			next = node;
		}
	}
}

/** Positions of a longest strictly increasing subsequence of `values`, ignoring entries below 0. */
function longestIncreasingRun(values) {
	const tails = [];
	const previous = new Array(values.length);
	for (let i = 0; i < values.length; i += 1) {
		const value = values[i];
		if (value < 0) continue;
		let low = 0;
		let high = tails.length;
		while (low < high) {
			const middle = (low + high) >> 1;
			if (values[tails[middle]] < value) low = middle + 1;
			else high = middle;
		}
		previous[i] = low > 0 ? tails[low - 1] : -1;
		tails[low] = i;
	}
	const keep = new Set();
	for (let i = tails.length ? tails[tails.length - 1] : -1; i >= 0; i = previous[i]) keep.add(i);
	return keep;
}

customElements.define('benchmark-app', Benchmark);
document.querySelector('#main').append(document.createElement('benchmark-app'));
