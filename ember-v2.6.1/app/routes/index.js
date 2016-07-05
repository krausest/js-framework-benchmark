import Ember from 'ember';

export default Ember.Route.extend({
  rows: Ember.inject.service('rows'),
  model() {
    return this.get('rows');
  },
});
