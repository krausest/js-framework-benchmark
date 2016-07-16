'use strict';

import {Store} from './store'
import domvm from 'domvm'

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
            var stop = performance.now();
            var duration = 0;
            console.log(lastMeasure+" took "+(stop-startTime));
        }, 0);
    }
}

let store = new Store();
let vm = domvm.view(View, store).mount(document.body);

function View(vm, store) {
	// stop timer after redraw
	vm.hook({
		didRedraw: function() {
			stopMeasure();
		}
	});

	let select = id => {
		startMeasure("select");
		store.select(id);
		vm.redraw();
	};

	let remove = id => {
		startMeasure("delete");
		store.delete(id);
		vm.redraw();
	};

	// delegated handler
	let tableClick = function(e) {
		let n = e.target._node;

		let action =
			n.props.class.indexOf("remove") != -1 ? remove :
			n.props.class.indexOf("lbl")    != -1 ? select : _ => 0;

		while (n.tag != "tr" && n.parent)
			n = n.parent;

		action(n.data);
	};

	return _ =>
	["#main",
		[".container",
		 	[Jumbo, store, false],
			["table.table.table-hover.table-striped.test-data", {onclick: tableClick},
				["tbody", store.data.map(item =>
					[Row, {store: store, item: item}, false]
				)]
			],
			["span.preloadicon.glyphicon.glyphicon-remove", {"aria-hidden": true}]
		]
	]
}

function Row(vm) {
	vm.diff(ctx => [ctx.item.id === ctx.store.selected, ctx.item.label, ctx.item.id]);

	return (vm, ctx) =>
	["tr", {class: ctx.item.id === ctx.store.selected ? 'danger' : null, _data: ctx.item.id},
		["td.col-md-1", ctx.item.id],
		["td.col-md-4",
			["a.lbl", ctx.item.label]
		],
		["td.col-md-1",
			["a.remove",
				["span.glyphicon.glyphicon-remove", {"aria-hidden": true}]
			]
		],
		["td.col-md-6"]
	]
}

function Jumbo(vm, store) {
	let run			= e => { startMeasure("run");		store.run();		vm.redraw(1); };
	let runLots		= e => { startMeasure("runLots");	store.runLots();	vm.redraw(1); };
	let add			= e => { startMeasure("add");		store.add();		vm.redraw(1); };
	let update		= e => { startMeasure("update");	store.update();		vm.redraw(1); };
	let clear		= e => { startMeasure("clear");		store.clear();		vm.redraw(1); };
	let swapRows	= e => { startMeasure("swapRows");	store.swapRows();	vm.redraw(1); };

	vm.diff(_ => [true]);

	return _ =>
	[".jumbotron",
		[".row",
			[".col-md-6",
				["h1", "domvm v1.2.9"]
			],
			[".col-md-6",
				[".row",
					[".col-sm-6.smallpad",
						["button.btn.btn-primary.btn-block#run", {type: "button", onclick: run}, "Create 1,000 rows"]
					],
					[".col-sm-6.smallpad",
						["button.btn.btn-primary.btn-block#runlots", {type: "button", onclick: runLots}, "Create 10,000 rows"]
					],
					[".col-sm-6.smallpad",
						["button.btn.btn-primary.btn-block#add", {type: "button", onclick: add}, "Append 1,000 rows"]
					],
					[".col-sm-6.smallpad",
						["button.btn.btn-primary.btn-block#update", {type: "button", onclick: update}, "Update every 10th row"]
					],
					[".col-sm-6.smallpad",
						["button.btn.btn-primary.btn-block#clear", {type: "button", onclick: clear}, "Clear"]
					],
					[".col-sm-6.smallpad",
						["button.btn.btn-primary.btn-block#swaprows", {type: "button", onclick: swapRows}, "Swap Rows"]
					]
				]
			]
		]
	]
}