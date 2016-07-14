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

	let run			= e => { startMeasure("run");		store.run();		vm.redraw(); };
	let runLots		= e => { startMeasure("runLots");	store.runLots();	vm.redraw(); };
	let add			= e => { startMeasure("add");		store.add();		vm.redraw(); };
	let update		= e => { startMeasure("update");	store.update();		vm.redraw(); };
	let clear		= e => { startMeasure("clear");		store.clear();		vm.redraw(); };
	let swapRows	= e => { startMeasure("swapRows");	store.swapRows();	vm.redraw(); };

	let select = (e, node) => {
		startMeasure("select");
		store.select(node.data);
		vm.redraw();
		return false;
	};

	let remove = (e, node) => {
		startMeasure("delete");
		store.delete(node.data == null ? node.parent.data : node.data);
		vm.redraw();
		return false;
	};

	// delegated handler
	let tableClick = {
		".remove, .remove *": remove,
		".lbl": select,
	};

	return _ =>
	["#main",
		[".container",
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
			],
			["table.table.table-hover.table-striped.test-data", {onclick: tableClick},
				["tbody", store.data.map(item =>
					["tr", {class: item.id === store.selected ? 'danger' : null},
						["td.col-md-1", item.id],
						["td.col-md-4",
							["a.lbl", {_data: item.id}, item.label]
						],
						["td.col-md-1",
							["a.remove", {_data: item.id},
								["span.glyphicon.glyphicon-remove", {"aria-hidden": true}]
							]
						],
						["td.col-md-6"]
					]
				)]
			],
			["span.preloadicon.glyphicon.glyphicon-remove", {"aria-hidden": true}]
		]
	]
}