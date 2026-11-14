import { createRoot } from '@ecopages/jsx/client';
import { Model } from './model.js';
import { createView } from './view.jsx';

createRoot(document.querySelector('#main')).render(createView(new Model()));
