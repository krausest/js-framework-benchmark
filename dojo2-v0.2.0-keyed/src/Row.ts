import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, HNODE } from '@dojo/widget-core/d';

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
		const { id, selected, label } = this.properties;

		return {
			type: HNODE,
			tag: 'tr',
			properties: {
				classes: [ selected ? 'danger' : null ]
			},
			children: [
				{
					type: HNODE,
					tag: 'td',
					properties: {
						classes: [ 'col-md-1' ]
					},
					children: [ `${id}` ]
				},
				{
					type: HNODE,
					tag: 'td',
					properties: {
						classes: [ 'col-md-4' ]
					},
					children: [
						{
							type: HNODE,
							tag: 'a',
							properties: {
								onclick: this._onClick
							},
							children: [ label ]
						}
					]
				},
				{
					type: HNODE,
					tag: 'td',
					properties: {
						classes: [ 'col-md-1' ]
					},
					children: [
						{
							type: HNODE,
							tag: 'a',
							properties: {
								onclick: this._onDelete
							},
							children: [
								{
									type: HNODE,
									tag: 'span',
									properties: {
										'aria-hidden': true,
										classes: [ 'glyphicon', 'glyphicon-remove' ]
									}
								}
							]
						}
					]
				},
				{
					type: HNODE,
					tag: 'td',
					properties: {
						classes: [ 'col-md-6' ]
					}
				}
			]
		};
	}
}

export default Row;
