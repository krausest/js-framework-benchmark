import { create, v } from '@dojo/framework/core/vdom';
import store from './Store';

export interface RowProperties {
	onSelect: Function;
	id: number;
	label: string;
}

const factory = create({ store }).properties<RowProperties>();

export default factory(function Row({ properties, middleware: { store } }) {
	const { id, label, onSelect } = properties();

	return v('tr', {
		classes: [ store.selected === id && 'danger' ]
	}, [
		v('td', { classes: [ 'col-md-1' ] }, [ `${id}` ]),
		v('td', { classes: [ 'col-md-4' ] }, [
			v('a', { onclick: () => {
				onSelect(id);
			} }, [ label ])
		]),
		v('td', { classes: [ 'col-md-1' ] }, [
			v('a', { onclick: () => {
				store.del();
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
