'use strict';

import _ from 'underscore';
import Bb from 'backbone';
import { View, CollectionView } from 'backbone.marionette';
import rowTemplate from './row.tpl';

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

const Store = Bb.Collection.extend({
    initialize() {
        this.id = 1;
        this.selectedId = null;
    },
    getSelected() {
        if(this.selectedId) return this.get(this.selectedId);
    },
    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    },
    updateData(mod = 10) {
        for (let i=0;i<this.models.length;i+=10) {
            const label = this.models[i].get('label');
            this.models[i].set('label', label + ' !!!');
        }
    },
    delete(id, view) {
        view.removeRow(id);
        this.remove(id, { silent: true });
    },
    run() {
        if(this.model.length) this._clear();
        this.reset(this.buildData());
    },
    addData() {
        this.add(this.buildData(1000));
    },
    select(id, view) {
        view.setSelected(id);
        this.selectedId = id;
    },
    runLots() {
        if(this.model.length) this._clear();
        this.reset(this.buildData(10000));
    },
    _clear() {
        _.each(this.models, model => model.off());
        this._reset();
    },
    clear() {
        this._clear();
        this.trigger('reset', this);
    },
    swapRows() {
        if (this.length > 998) {
            const a = this.models[1];
            this.models[1] = this.models[998];
            this.models[998] = a;
            this.trigger('swap', this.models[1], this.models[998]);
        }
    }
});

const store = new Store();

const ChildView = View.extend({
    tagName: 'tr',
    attributes() {
        return {
            'data-id': this.model.id
        };
    },
    monitorViewEvents: false,
    template: rowTemplate
});

const MyCollectionView = CollectionView.extend({
    monitorViewEvents: false,
    viewComparator: false,
    el: '#tbody',
    childView: ChildView,
    collectionEvents() {
        return {
            'swap': this.onSwapRows,
            'change:label': this.onChangeLabel
        };
    },
    events() {
        return {
            'click .js-link': this.onSelectRow,
            'click .js-del': this.onDeleteRow
        };
    },
    onSelectRow(e) {
        const rowId = this.$(e.currentTarget).parent().parent().data('id');
        // setSelected(rowId);  // moved to collection for measuring
        this.collection.select(rowId, this);
    },
    onDeleteRow(e) {
        const rowId = this.$(e.currentTarget).parent().parent().data('id');
        // this.removeRow(rowId);  // moved to collection for measuring
        this.collection.delete(rowId, this);
    },
    setSelected(id) {
        this.clearSelected();

        const model = this.collection.get(id);
        const view = this.children.findByModelCid(model.cid);
        view.$el.addClass('danger');
    },
    removeRow(id) {
        const model = this.collection.get(id);
        const view = this.children.findByModelCid(model.cid);
        this.removeChildView(view);
    },
    onSwapRows(model1, model2) {
        var view1 = this.children.findByModelCid(model1.cid);
        var view2 = this.children.findByModelCid(model2.cid);

        this.swapChildViews(view1, view2);
    },
    onChangeLabel(model, label) {
        const view = this.children.findByModelCid(model.cid);
        view.$('.js-link').text(label);
    },
    onRender() {
        this.clearSelected();
        this.collection.selectedId = null;
    },
    clearSelected() {
        const selected = this.collection.getSelected();

        if (!selected) {
            return;
        }
        const curSelected = this.children.findByModelCid(selected.cid);
        curSelected.$el.removeClass('danger');
    }
});

const collectionView = new MyCollectionView({
    collection: store
});

collectionView.render();

const MainView = View.extend({
    el : '.jumbotron',
    events: {
        'click #run'() { store.run(); },
        'click #runlots'() { store.runLots(); },
        'click #add'() { store.addData(); },
        'click #update'() { store.updateData(); },
        'click #clear'() { store.clear(); },
        'click #swaprows'() { store.swapRows(); },
    }
});

new MainView();
