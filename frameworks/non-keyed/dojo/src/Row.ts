import { create, v } from '@dojo/framework/core/vdom';

export interface RowProperties {
	label: string;
	id: number;
	onDelete: Function;
	onSelect: Function;
	selected: number | undefined;
}

const factory = create({}).properties<RowProperties>();

export default factory(function Row({ properties }) {
	const { id, label, onSelect, onDelete, selected } = properties();

	return v('tr', {
		classes: [ selected === id && 'danger' ]
	}, [
		v('td', { classes: [ 'col-md-1' ] }, [ `${id}` ]),
		v('td', { classes: [ 'col-md-4' ] }, [
			v('a', { onclick: () => {
				onSelect(id);
			} }, [ label ])
		]),
		v('td', { classes: [ 'col-md-1' ] }, [
			v('a', { onclick: () => {
				onDelete(id);
			} }, [
				v('span', {
					'aria-hidden': true,
					classes: [ 'glyphicon', 'glyphicon-remove' ]
				})
			])
		]),
		v('td', { classes: [ 'col-md-6' ] })
	]);
});
