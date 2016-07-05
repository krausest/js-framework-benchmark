import Ember from 'ember';

export default Ember.Component.extend({
  rows: Ember.inject.service('rows'),
  actions : {
    add: function() {
      //console.log("add");
      this.get('rows').add();
    },
    create: function() {
      //console.log("create",this.rows);
      this.get('rows').run();
    },
    update: function() {
      //console.log("update",this.rows);
      this.get('rows').update();
    },
    runLots: function() {
      this.get('rows').runLots();
    },
    clear: function() {
      this.get('rows').clear();
    },
    swapRows: function() {
      this.get('rows').swapRows();
    }
  }
});
