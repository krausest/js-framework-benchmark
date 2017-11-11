'use strict';

import _ from 'underscore';
import Bb from 'backbone';
import Mn from 'backbone.marionette';
import hbs from 'handlebars-inline-precompile';

const rowTemplate = hbs`
<td class="col-md-1">{{ id }}</td>
<td class="col-md-4">
<a class="js-link">{{ label }}</a>
</td>
<td class="col-md-1">
<a class="js-del">
<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
</a>
</td>
<td class="col-md-6"></td>
`;

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        // console.profileEnd(lastMeasure);
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
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
        this.reset(this.buildData(10000));
        stopMeasure();
    },
    clear() {
        startMeasure("clear");
        this.reset();
        stopMeasure();
    },
    swapRows() {
        startMeasure("swapRows");
        if (this.length > 10) {
            const a = this.models[4];
            this.models[4] = this.models[9];
            this.models[9] = a;
            this.trigger('swap', this.models[4], this.models[9]);
        }
        stopMeasure();
    }
});

const store = new Store();

const ChildView = Mn.View.extend({
    tagName: 'tr',
    attributes() {
        return {
            'data-id': this.model.id
        };
    },
    monitorViewEvents: false,
    template: rowTemplate
});

const CollectionView = Mn.NextCollectionView.extend({
    childViewEventPrefix: false,
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
        const view = this.children.findByModel(model);
        view.$el.addClass('danger');
    },
    removeRow(id) {
        const model = this.collection.get(id);
        const view = this.children.findByModel(model);
        this.removeChildView(view);
    },
    onSwapRows(model1, model2) {
        var view1 = this.children.findByModel(model1);
        var view2 = this.children.findByModel(model2);

        this.swapChildViews(view1, view2);
    },
    onChangeLabel(model) {
        const view = this.children.findByModel(model);
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
        const curSelected = this.children.findByModel(selected);
        curSelected.$el.removeClass('danger');
    }
});

const collectionView = new CollectionView({
    collection: store
});

collectionView.render();

const MainView = Mn.View.extend({
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
