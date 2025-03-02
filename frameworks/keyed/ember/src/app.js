import Application from '@ember/application';
import Resolver from 'ember-resolver';

import { registry } from './registry.js';

export default class App extends Application {
  modulePrefix = 'results';
  Resolver = Resolver.withModules(registry);
}
