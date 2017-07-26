import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';

import { Data } from './Store';

export interface RowProperties {
	onRowSelected: (id: number) => void;
	onRowDeleted: (id: number) => void;
	selected: boolean;
	label: string;
	id: number;
}

export class Row extends WidgetBase<RowProperties> {

	private _onDelete() {
		const { onRowDeleted, id } = this.properties;
		onRowDeleted(id);
	}

	private _onClick() {
		const { onRowSelected, id } = this.properties;
		onRowSelected(id);
	}

	protected render(): DNode {
		const { selected, label, key } = this.properties;
		return v('tr', { classes: { danger: selected } }, [
			v('td', { classes: { 'col-md-1': true } }, [ key ]),
			v('td', { classes: { 'col-md-4': true } }, [
				v('a', { onclick: this._onClick }, [ label ])
			]),
			v('td', { classes: { 'col-md-1': true } }, [
				v('a', { onclick: this._onDelete }, [
					v('span', { 'aria-hidden': true, classes: { glyphicon: true, 'glyphicon-remove': true }})
				])
			]),
			v('td', { classes: { 'col-md-6': true } })
		]);
	}
}

export default Row;
