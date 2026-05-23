import Application from '@ember/application';
import Resolver from 'ember-resolver';
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
  modulePrefix = 'results';
  Resolver = Resolver.withModules({
    'results/router': Router,
    'results/services/state': State,
    'results/templates/application': <template>
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
  });
}
