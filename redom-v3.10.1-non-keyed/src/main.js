'use strict';

import { mount } from 'redom';
import { App } from './app.js';
import { Store } from './store.js';

const store = new Store();
const app = new App({ store });

mount(document.body, app);
