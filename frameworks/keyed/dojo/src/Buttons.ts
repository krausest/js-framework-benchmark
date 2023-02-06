import { create, w, v, diffProperty } from '@dojo/framework/core/vdom'
import Button from './Button';

export interface ButtonConfig {
	id: string;
	label: string;
	onClick: () => void;
}

export interface ButtonsProperties {
	buttonConfigs: ButtonConfig[];
}

const factory = create({ diffProperty }).properties<ButtonsProperties>();

export default factory(function Buttons({ properties, middleware: { diffProperty } }) {
	diffProperty('buttonConfigs', properties, () => {});
	const { buttonConfigs } = properties();
	return v('div', { classes: [ 'jumbotron' ] }, [
		v('div', { classes: [ 'row' ] }, [
			v('div', { classes: [ 'col-md-6' ] }, [
				v('h1', ['Dojo'])
			]),
			v('div', { classes: [ 'col-md-6' ] }, buttonConfigs.map(({ id, label, onClick }) => {
				return w(Button, { key: id, id, label, onClick });
			}))
		])
	]);
});
