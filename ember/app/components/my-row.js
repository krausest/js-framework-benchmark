import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  rows: Ember.inject.service('rows'),
  classNameBindings: ['isSelected:danger:x'],
  isSelected : function() {
    return this.get('rows.selected') === this.get('item.identifier');
  }.property('rows.selected'),
  actions: {
    remove() {
      this.get('rows').remove(this.get('item.identifier'));
    },
    select() {
      this.get('rows').select(this.get('item.identifier'));
    }
  }
});
