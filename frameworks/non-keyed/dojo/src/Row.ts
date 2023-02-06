import { create, v } from '@dojo/framework/core/vdom';
import store from './Store';

export interface RowProperties {
	id: number;
	label: string;
}

const factory = create({ store }).properties<RowProperties>();

export default factory(function Row({ properties, middleware: { store } }) {
	const { id, key = id, label } = properties();

	return v('tr', {
		classes: [ store.selected === key && 'danger' ]
	}, [
		v('td', { classes: [ 'col-md-1' ] }, [ `${id}` ]),
		v('td', { classes: [ 'col-md-4' ] }, [
			v('a', { onclick: () => {
				store.select();
			} }, [ label ])
		]),
		v('td', { classes: [ 'col-md-1' ] }, [
			v('a', { onclick: () => {
				store.del();
			} }, [
				v('span', {
					'aria-hidden': 'true',
					classes: [ 'glyphicon', 'glyphicon-remove' ]
				})
			])
		]),
		v('td', { classes: [ 'col-md-6' ] })
	]);
});
