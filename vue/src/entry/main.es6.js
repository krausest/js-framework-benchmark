'use strict';

var Vue = require('vue');
var {Store} = require('./store');

var store = new Store();

new Vue({
    el: '#main',
    data: {
        rows: store.data,
        selected: store.selected
    },
    methods: {
        add() {
            store.add();
            this.rows = store.data;
            this.selected = store.selected;
        },
        remove(item) {
            store.delete(item.id);
            this.rows = store.data;
            this.selected = store.selected;
        },
        select(item) {
            store.select(item.id);
            this.rows = store.data;
            this.selected = store.selected;
        },
        run() {
            store.run();
            this.rows = store.data;
            this.selected = store.selected;
        },
        update() {
            store.update();
            this.rows = store.data;
            this.selected = store.selected;
        }
    }
})