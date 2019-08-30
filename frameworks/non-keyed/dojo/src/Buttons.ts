import { create, w, v } from '@dojo/framework/core/vdom'
import Button from './Button';

export interface ButtonConfig {
	id: string;
	label: string;
	onClick: () => void;
}

export interface ButtonsProperties {
	buttonConfigs: ButtonConfig[];
}

const factory = create().properties<ButtonsProperties>();

export default factory(function Buttons({ properties }) {
	const { buttonConfigs } = properties();
	return v('div', { classes: [ 'jumbotron' ] }, [
		v('div', { classes: [ 'row' ] }, [
			v('div', { classes: [ 'col-md-6' ] }, [
				v('h1', ['Dojo v6.0.0'])
			]),
			v('div', { classes: [ 'col-md-6' ] }, buttonConfigs.map(({ id, label, onClick }) => {
				return w(Button, { key: id, id, label, onClick });
			}))
		])
	]);
});
