'use strict';

import { View, CollectionView, setDataApi, setDomApi } from 'marionette';
import DomApi from '@mnjs/adapters/dom/morphdom';
import { Collection, DataApi } from '@mnjs/data';
import rowTemplate from './rowtemplate';

setDataApi(DataApi);
setDomApi(DomApi);

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

const Store = Collection.extend({
    initialize() {
        this.nextId = 1;
        this.selectedId = null;
    },
    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({id: this.nextId++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]});
        }
        return data;
    },
    updateData(mod = 10) {
        for (let i=0;i<this.length;i+=mod) {
            const model = this.at(i);
            model.set('label', model.get('label') + ' !!!');
        }
    },
    run() {
        this.resetData(this.buildData());
    },
    addData() {
        this.add(this.buildData(1000));
    },
    runLots() {
        this.resetData(this.buildData(10000));
    },
    resetData(models = []) {
        this.selectedId = null;
        this.reset(models);
    },
    select(id) {
        const previousId = this.selectedId;
        this.selectedId = id;
        this.trigger('change:selected', id, previousId);
    },
    removeRow(id) {
        if (this.selectedId === id) this.selectedId = null;
        this.remove(id);
    },
    swapRows() {
        if (this.length > 998) {
            const first = this.at(1);
            const second = this.at(998);
            this.move(first, 998, { silent: true });
            this.move(second, 1, { silent: true });
            this.trigger('swap:rows', first, second);
        }
    }
});

const store = new Store();

const ChildView = View.extend({
    monitorViewEvents: false,
    tagName: 'tr',
    attributes() {
        return {
            'data-id': this.model.id
        };
    },
    className() {
        return this.model.id === store.selectedId ? 'danger' : null;
    },
    template: rowTemplate
});

const MyCollectionView = CollectionView.extend({
    monitorViewEvents: false,
    sortWithCollection: false,
    el: document.querySelector('#tbody'),
    childView: ChildView,
    collectionEvents() {
        return {
            'swap:rows': this.onSwapRows,
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
    _getRowId(event) {
        return Number(event.delegateTarget.closest('tr').dataset.id);
    },
    onSelectRow(event) {
        this.collection.select(this._getRowId(event));
    },
    onDeleteRow(event) {
        this.collection.removeRow(this._getRowId(event));
    },
    onSwapRows(first, second) {
        this.swapChildViews(
            this.children.findByModel(first),
            this.children.findByModel(second)
        );
    },
    onChangeLabel(model) {
        const view = this.children.findByModel(model);
        view.render();
    },
    onChangeSelected(id, previousId) {
        if (previousId) {
            const previous = this.children.findByModel(this.collection.get(previousId));
            previous?.renderAttributes();
        }

        if (!id) return;

        const selected = this.children.findByModel(this.collection.get(id));
        selected.renderAttributes();
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
        'click #clear'() { store.resetData(); },
        'click #swaprows'() { store.swapRows(); },
    }
});

new MainView();
