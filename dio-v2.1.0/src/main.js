import {Store, startMeasure, stopMeasure} from './store.js'

var dio = require("imports?define=>false!dio.js").dio;

var {VElement, VComponent, VText, VBlueprint, version} = dio;

console.log("***", VElement, VComponent, VText, VBlueprint, version);

var colMd1   = {className: 'col-md-1'};
var colMd4   = {className: 'col-md-4'};
var colMd6   = {className: 'col-md-6'};
var colSm6   = {className: 'col-sm-6 smallpad'};

var RowEmpty    = VElement('td', colMd6);
var RowDelIcon  = VElement('span', {className: 'glyphicon glyphicon-remove', 'aria-hidden': 'true'});
var preLoadIcon = VElement('span', {className: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': 'true'});

function Nav (run, runLots, add, update, clear, swapRows) {
    return (
        VElement('div', {className: 'jumbotron'}, [
            VElement('div', {className: 'row'}, [
                VElement('div', colMd6, [
                    VElement('h1', null, [VText("dio v"+version)])
                ]),
                VElement('div', colMd6, [
                    VElement('div', {className: 'row'}, [
                        VElement('div', colSm6, [
                            VElement('button', {id: 'run', onClick: run, className: 'btn btn-primary btn-block'}, [
                                VText('Create 1,000 rows')
                            ])
                        ]),
                        VElement('div', colSm6, [
                            VElement('button', {id: 'runlots', onClick: runLots, className: 'btn btn-primary btn-block'}, [
                                VText('Create 10,000 rows')
                            ])
                        ]),
                        VElement('div', colSm6, [
                            VElement('button', {id: 'add', onClick: add, className: 'btn btn-primary btn-block'}, [
                                VText('Append 1,000 rows')
                            ])
                        ]),
                        VElement('div', colSm6, [
                            VElement('button', {id: 'update', onClick: update, className: 'btn btn-primary btn-block'}, [
                                VText('Update every 10th row')
                            ])
                        ]),
                        VElement('div', colSm6, [
                            VElement('button', {id: 'clear', onClick: clear, className: 'btn btn-primary btn-block'}, [
                                VText('Clear')
                            ])
                        ]),
                        VElement('div', colSm6, [
                            VElement('button', {id: 'swaprows', onClick: swapRows, className: 'btn btn-primary btn-block'}, [
                                VText('Swap Rows')
                            ])
                        ])
                    ])
                ])
            ])
        ])
    );
}

function Row (id, label, selected, onDelete, onSelect) {
    return (
        VElement('tr', {className: id === selected ? 'danger' : ''}, [
            VElement('td', colMd1, [VText(id)]),
            VElement('td', colMd4, [VElement('a', {value: {id: id, fn: onSelect}}, [VText(label)])]),
            VElement('td', colMd1, [VElement('a', {value: {id: id, fn: onDelete}}, [RowDelIcon])]),
            RowEmpty
        ])
    );
}

class Main extends dio.Component {
    printDuration() {
        stopMeasure();
    }
    componentDidUpdate() {
        this.printDuration();
    }
    componentDidMount() {
        this.printDuration();
    }
    run() {
        startMeasure("run");
        this.state.store.run();
        this.forceUpdate();
    }
    add() {
        startMeasure("add");
        this.state.store.add();
        this.forceUpdate();
    }
    update() {
        startMeasure("update");
        this.state.store.update();
        this.forceUpdate();
    }
    select(id) {
        startMeasure("select");
        this.state.store.select(id);
        this.forceUpdate();
    }
    delete(id) {
        startMeasure("delete");
        this.state.store.delete(id);
        this.forceUpdate();
    }
    runLots() {
        startMeasure("runLots");
        this.state.store.runLots();
        this.forceUpdate();
    }
    clear() {
        startMeasure("clear");
        this.state.store.clear();
        this.forceUpdate();
    }
    swapRows() {
        startMeasure("swapRows");
        this.state.store.swapRows();
        this.forceUpdate();
    }
	function handleClick(e) {
		var fn, id, target = e.target, val = target.value;

		if (val !== void 0) {
			fn = val.fn, id = val.id;
		} else {
			val = target.parentNode.value;
			if (val !== void 0) {
				fn = val.fn, id = val.id;
			}
		}

		fn && fn(id);
	}
    constructor(props) {
        super(props);
        this.state   = {store: new Store()};
        this.autoBind('delete', 'select', 'run', 'runLots', 'add', 'update', 'clear', 'swapRows');
        this.nav = Nav(this.run, this.runLots, this.add, this.update, this.clear, this.swapRows);
    }
    render(props, state, self) {
        var store    = state.store;
        var data     = store.data;
        var selected = store.selected;
        var length   = data.length;
        var onDelete = this.delete;
        var onSelect = this.select;
        var nav      = this.nav;
        var rows     = new Array(length);

        for (var i = 0; i < length; i = i + 1) {
            var d = data[i];
            rows[i] = Row(d.id, d.label, selected, onDelete, onSelect);
        }

        return (
            VElement('div', {className: 'container'}, [
                nav,
                VElement('table', {className: 'table table-hover table-striped test-data'}, [
                    VElement('tbody', {onClick: this.handleClick}, rows)
                ]),
                preLoadIcon
            ])
        );
    }
}

VBlueprint([RowDelIcon, preLoadIcon, RowEmpty]);

dio.render(VComponent(Main), '#main');
