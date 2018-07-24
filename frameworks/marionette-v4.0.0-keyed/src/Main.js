'use strict';

import _ from 'underscore';
import Bb from 'backbone';
import { View, CollectionView, setDomApi } from 'backbone.marionette';
import './mn-native-view';
import morphdomRenderer from './mn-morphdom-renderer';
import rowTemplate from './rowtemplate';
import DomApi from './mn-domapi';

setDomApi(DomApi);

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

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
        startMeasure("update");
        for (let i=0;i<this.models.length;i+=10) {
            const label = this.models[i].get('label');
            this.models[i].set('label', label + ' !!!');
        }
        stopMeasure();
    },
    delete(id, view) {
        startMeasure("delete");
        view.removeRow(id);
        this.remove(id, { silent: true });
        stopMeasure();
    },
    run() {
        startMeasure("run");
        if(this.model.length) this._clear();
        this.reset(this.buildData());
        stopMeasure();
    },
    addData() {
        startMeasure("add");
        this.add(this.buildData(1000));
        stopMeasure();
    },
    select(id, view) {
        startMeasure("select");
        view.setSelected(id);
        this.selectedId = id;
        stopMeasure();
    },
    runLots() {
        startMeasure("runLots");
        if(this.model.length) this._clear();
        this.reset(this.buildData(10000));
        stopMeasure();
    },
    _clear() {
        _.each(this.models, model => model.off());
        this._reset();
    },
    clear() {
        startMeasure("clear");
        this._clear();
        this.trigger('reset', this);
        stopMeasure();
    },
    swapRows() {
        startMeasure("swapRows");
        if (this.length > 998) {
            const a = this.models[1];
            this.models[1] = this.models[998];
            this.models[998] = a;
            this.trigger('swap', this.models[1], this.models[998]);
        }
        stopMeasure();
    }
});

const store = new Store();

const ChildView = View.extend({
    el: document.createElement('div'),
    monitorViewEvents: false,
    template: rowTemplate
});

ChildView.setRenderer(morphdomRenderer);

const MyCollectionView = CollectionView.extend({
    monitorViewEvents: false,
    viewComparator: false,
    el: [document.querySelector('#tbody')],
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
    _getRowId(target) {
        return target.parentNode.parentNode.dataset.id;
    },
    onSelectRow(e) {
        const rowId = this._getRowId(e.target);
        // setSelected(rowId);  // moved to collection for measuring
        this.collection.select(rowId, this);
    },
    onDeleteRow(e) {
        const rowId = this._getRowId(e.target.parentNode);
        // this.removeRow(rowId);  // moved to collection for measuring
        this.collection.delete(rowId, this);
    },
    setSelected(id) {
        this.clearSelected();

        const model = this.collection.get(id);
        const view = this.children.findByModelCid(model.cid);
        view.el.classList.add('danger');
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
    onChangeLabel(model) {
        const view = this.children.findByModelCid(model.cid);
        view.render();
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
        curSelected.el.classList.remove('danger');
    }
});

const collectionView = new MyCollectionView({
    collection: store
});

collectionView.render();

const MainView = View.extend({
    el: [document.querySelector('.jumbotron')],
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
