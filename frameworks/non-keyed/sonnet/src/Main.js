import { createApp } from '@sonnetjs/core';
import App from './App';

const app = createApp();
app.root(App);
app.mount('#main');
