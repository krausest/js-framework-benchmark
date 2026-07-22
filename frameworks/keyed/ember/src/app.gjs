import Application from '@ember/application';
import EmberRouter from '@ember/routing/router';
import config from '#config';
import { TheTable } from './components/the-table.gjs';
import { Jumbotron } from './components/jumbotron.gjs';
import State from './services/state.js';

class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('index.html');
});

export default class App extends Application {
  modules = {
    './router': Router,
    './services/state': State,
    './templates/application': <template>
      <div id="main">
        <div class="container">
          <Jumbotron />
          <TheTable />

          <span
            class="preloadicon glyphicon glyphicon-remove"
            aria-hidden="true"
          ></span>
        </div>
      </div>
    </template>,
  };
}
