import { create, w, v } from '@dojo/framework/core/vdom'

export interface ButtonProperties {
	id: string;
	label: string;
	onClick: () => void;
}

const factory = create().properties<ButtonProperties>();

export default factory(function Button({ properties }) {
	const { id, label, onClick } = properties();

	return v('div', { classes: [ 'col-sm-6', 'smallpad' ] }, [
		v('button', {
			id,
			classes: [ 'btn', 'btn-primary', 'btn-block' ],
			onclick: onClick
		}, [ label ])
	]);
});
