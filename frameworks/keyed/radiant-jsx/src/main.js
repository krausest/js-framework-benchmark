import { RadiantElement } from '@ecopages/radiant';
import { Model } from './model.js';
import { createView } from './view.jsx';

class Benchmark extends RadiantElement {
	model = new Model();
	view = createView(this.model, 'Radiant + Ecopages JSX');

	render() {
		return this.view;
	}
}

customElements.define('benchmark-app', Benchmark);
document.querySelector('#main').append(document.createElement('benchmark-app'));
