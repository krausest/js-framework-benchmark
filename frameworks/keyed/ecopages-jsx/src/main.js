import { createRoot } from '@ecopages/jsx/client';
import { Model } from './model.js';
import { createView } from './view.jsx';

/** Renders the view once; signals in the model update the rows, labels and classes from then on. */
createRoot(document.querySelector('#main')).render(createView(new Model(), 'Ecopages JSX'));
