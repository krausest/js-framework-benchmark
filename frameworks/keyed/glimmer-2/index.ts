import { renderComponent } from '@glimmer/core';
import App from './src/App';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const element = document.getElementById('app');
    renderComponent(App, {
      owner: {},
      element: element!
    });
  },
  { once: true }
);
