'use strict';

import { View, CollectionView, MnObject } from 'marionette';
import morphdomRenderer from './mn-morphdom-renderer';
import rowTemplate from './rowtemplate';

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

const Store = MnObject.extend({
    initialize() {
        this.cid = 1;
        this.models = [];
        this.selectedId = null;
    },
    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++) {
            const id = this.cid + '';
            data.push({cid: id, attributes: { id, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] }});
            this.cid++;
        }
        return data;
    },
    updateData(mod = 10) {
        for (let i=0;i<this.models.length;i+=10) {
            this.models[i].attributes.label += ' !!!';
            this.trigger('change:label', this.models[i]);
        }
    },
    run() {
        this.reset(this.buildData());
    },
    addData() {
        this.add(this.buildData(1000));
    },
    runLots() {
        this.reset(this.buildData(10000));
    },
    select(id) {
        const prevId = this.selectedId;
        this.selectedId = id;
        this.trigger('change:selected', id, prevId);
    },
    add(models) {
        this.models = this.models.concat(models);
        this.trigger('update', this, { changes: { added: models, removed: [] }});
    },
    remove(id) {
        const [removed] = this.models.splice(this.models.findIndex(model => model.cid === id), 1);
        this.trigger('remove', removed);
    },
    reset(models = []) {
        this.models = models;
        this.trigger('reset', this);
    },
    swapRows() {
        if (this.models.length > 998) {
            const a = this.models[1];
            this.models[1] = this.models[998];
            this.models[998] = a;
            this.trigger('swap', this.models[1], this.models[998]);
        }
    }
});

const store = new Store();

const ChildView = View.extend({
    el: document.createElement('div'),
    monitorViewEvents: false,
    template: rowTemplate,
    templateContext() {
        return {
            className: (store.selectedId === this.model.cid) ? 'danger': ''
        };
    }
});

ChildView.setRenderer(morphdomRenderer);

const MyCollectionView = CollectionView.extend({
    monitorViewEvents: false,
    viewComparator: false,
    el: document.querySelector('#tbody'),
    childView: ChildView,
    collectionEvents() {
        return {
            'swap': this.onSwapRows,
            'remove': this.onRemoveRow,
            'change:label': this.onChangeLabel,
            'change:selected': this.onChangeSelected,
        };
    },
    events() {
        return {
            'click .js-link': this.onSelectRow,
            'click .js-del': this.onDeleteRow
        };
    },
    _getRowId(target) {
        return target.parentNode.parentNode.dataset.id;
    },
    onSelectRow(e) {
        const rowId = this._getRowId(e.target);

        this.collection.select(rowId);
    },
    onDeleteRow(e) {
        const rowId = this._getRowId(e.target.parentNode);

        this.collection.remove(rowId);
    },
    onRemoveRow(model) {
        const view = this.children.findByModelCid(model.cid);
        this.removeChildView(view);
    },
    onSwapRows(model1, model2) {
        var view1 = this.children.findByModelCid(model1.cid);
        var view2 = this.children.findByModelCid(model2.cid);

        this.swapChildViews(view1, view2);
    },
    onChangeLabel(model) {
        const view = this.children.findByModelCid(model.cid);
        view.render();
    },
    onChangeSelected(id, prevId) {
        if (prevId) {
            const curSelected = this.children.findByModelCid(prevId);
            curSelected && curSelected.render();
        }

        if (!id) return;

        const selected = this.children.findByModelCid(id);
        selected.render();
    },
});

const collectionView = new MyCollectionView({
    collection: store
});

collectionView.render();

const MainView = View.extend({
    el: document.querySelector('.jumbotron'),
    events: {
        'click #run'() { store.run(); },
        'click #runlots'() { store.runLots(); },
        'click #add'() { store.addData(); },
        'click #update'() { store.updateData(); },
        'click #clear'() { store.reset(); },
        'click #swaprows'() { store.swapRows(); },
    }
});

new MainView();
