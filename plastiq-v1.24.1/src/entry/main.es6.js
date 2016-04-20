var plastiq = require('plastiq');
const {Store} = require('./store');

var h = plastiq.html;

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
            var duration = 0;
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

var renderItem = function(self, item) {
	return h('tr', {
			key: item.id,
			data: item,
			className: item.id === self.store.selected ? 'danger' : ''
		},
		h('td.col-md-1', item.id),
		h('td.col-md-4',
			h('a', {
				onclick: () => self.select(item.id)
			}, item.label)
		),
		h('td.col-md-1',
			h('a', {
				onclick: () => self.delete(item.id)
			}, h('span.glyphicon.glyphicon-remove'))
		),
		h('td.col-md-6')
	);
};

function createApp() {
	return {
		delete: function(id) {
			this.store.delete(id);
		},
		select: function(id) {
			this.store.select(id);
		},
		store: new Store(),
		render: function() {
			var self = this;
			return h('div.container',
				h('div.jumbotron div.row',
					h('div.col-md-8 h1', 'plastiq v1.24.1'),
					h('div.col-md-4',
						h('button.btn.btn-primary.btn-block', {
							attributes: {
								type: 'button',
								id: 'add'
							},
							onclick: function() {
								self.store.add();
							}
						}, 'Add 1000 rows'),
						h('button.btn.btn-primary.btn-block', {
							attributes: {
								type: 'button',
								id: 'run'
							},
							onclick: function() {
								self.store.run();
							}
						}, 'Create 1000 rows'),
						h('button.btn.btn-primary.btn-block', {
							attributes: {
								type: 'button',
								id: 'update'
							},
							onclick: function() {
								self.store.update();
							}
						}, 'Update every 10th row'),
						h('button.btn.btn-primary.btn-block', {
							attributes: {
								type: 'button',
								id: 'hideall'
							},
							onclick: function() {
								self.store.hideAll();
							}
						}, 'HideAll'),
						h('button.btn.btn-primary.btn-block', {
							attributes: {
								type: 'button',
								id: 'showall'
							},
							onclick: function() {
								self.store.showAll();
							}
						}, 'ShowAll'),
						h('button.btn.btn-primary.btn-block', {
							attributes: {
								type: 'button',
								id: 'runlots'
							},
							onclick: function() {
								self.store.runLots();
							}
						}, 'Create lots of rows'),
						h('button.btn.btn-primary.btn-block', {
							attributes: {
								type: 'button',
								id: 'clear'
							},
							onclick: function() {
								self.store.clear();
							}
						}, 'Clear'),
						h('h3#duration span.glyphicon.glyphicon-remove')
					)
				),
				h('table.table.table-hover.table-striped.test-data tbody',
					self.store.data.map(function(item) {
						return renderItem(self, item);
					})
				)
			);
		}
	};
};

plastiq.append(document.body, createApp());