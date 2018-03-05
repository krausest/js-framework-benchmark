import './polyfill';
import app from './app';

if (window.WebComponents && window.WebComponents.ready) {
  app();
} else {
  window.addEventListener('WebComponentsReady', app);
}
