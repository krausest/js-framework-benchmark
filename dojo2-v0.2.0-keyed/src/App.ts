import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { Row } from './Row';
import { Buttons, ButtonConfig } from './Buttons';
import { Store } from  './Store';

let startTime: number;
let lastMeasure: string | null;

function startMeasure(name: string) {
	startTime = performance.now();
	lastMeasure = name;
}

function stopMeasure() {
	const last = lastMeasure;
	if (lastMeasure) {
		setTimeout(function () {
			lastMeasure = null;
			const stop = performance.now();
			const duration = 0;
			console.log(`${last} took ${(stop - startTime)}`);
		}, 0);
	}
}

class Container extends WidgetBase {
	render() {
		return v('table', { classes: [ 'table', 'table-hover', 'table-striped', 'test-data' ] }, [ v('tbody', {}, this.children) ]);
	}
}

export class App extends WidgetBase {
	private _store: Store = new Store();

	private _printDuration() {
		stopMeasure();
	}

	protected onElementUpdated() {
		this._printDuration();
	}

	protected onElementCreated() {
		this._printDuration();
	}

	private _run = () => {
		startMeasure('run');
		this._store.run();
		this.invalidate();
	}

	private _add = () => {
		startMeasure('add');
		this._store.add();
		this.invalidate();
	}

	private _update = () => {
		startMeasure('update');
		this._store.update();
		this.invalidate();
	}

	private _select = (id: number) => {
		startMeasure('select');
		this._store.select(id);
		this.invalidate();
	}

	private _delete = (id: number) => {
		startMeasure('delete');
		this._store.delete(id);
		this.invalidate();
	}

	private _runLots = () => {
		startMeasure('runLots');
		this._store.runLots();
		this.invalidate();
	}

	private _clear = () => {
		startMeasure('clear');
		this._store.clear();
		this.invalidate();
	}

	private _swapRows = () => {
		startMeasure('swapRows');
		this._store.swapRows();
		this.invalidate();
	}

	private _buttonConfigs: ButtonConfig[] = [
		{ id: 'run', label: 'Create 1,000 rows', onClick: this._run },
		{ id: 'runlots', label: 'Create 10,000 rows', onClick: this._runLots },
		{ id: 'add', label: 'Append 1,000 rows', onClick: this._add },
		{ id: 'update', label: 'Update every 10th row', onClick: this._update },
		{ id: 'clear', label: 'Clear', onClick: this._clear },
		{ id: 'swaprows', label: 'Swap Rows', onClick: this._swapRows }
	];

	protected render (): DNode {
		const { _run, _add, _update, _select, _delete, _runLots, _clear, _swapRows, _store } = this;
		const rows = _store.data.map(({ id, label }, index) => {
			return w(Row, {
				id,
				key: id,
				label,
				onRowSelected: _select,
				onRowDeleted: _delete,
				selected: id === _store.selected
			});
		});

		return v('div', { key: 'root', classes: [ 'container' ] }, [
			w(Buttons, { buttonConfigs: this._buttonConfigs }),
			v('table', { classes: [ 'table', 'table-hover', 'table-striped', 'test-data' ] }, [
				v('tbody', rows)
			]),
			v('span', { classes: [ 'preloadicon', 'glyphicon', 'glyphicon-remove' ] })
		]);
	}
}

export default App;
