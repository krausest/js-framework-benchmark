import { ComponentManager } from '@glimmer/component';
import { setPropertyDidChange } from '@glimmer/tracking';
import App from './main';

const app = new App();
const containerElement = document.getElementById('app');

setPropertyDidChange(() => {
  app.scheduleRerender();
});

app.registerInitializer({
  initialize(registry) {
    registry.register(
      `component-manager:/${app.rootName}/component-managers/main`,
      ComponentManager
    );
  },
});

app.renderComponent('Glimmer', containerElement, null);

app.boot();
