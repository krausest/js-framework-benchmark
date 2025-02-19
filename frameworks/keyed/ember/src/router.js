import EmberRouter from '@ember/routing/router';

export default class Router extends EmberRouter {
  location = 'history';
  rootURL = '/frameworks/keyed/ember/';
}

Router.map(function () {
  this.route('index.html');
});
