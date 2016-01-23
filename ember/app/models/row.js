import DS from 'ember-data';

export default DS.Model.extend({
  identifier: DS.attr('string'),
  label: DS.attr('string')
});
