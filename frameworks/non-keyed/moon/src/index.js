var Moon = require("moon");

var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
var colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];

var nounsLength = nouns.length;
var adjectivesLength = adjectives.length;
var colorsLength = colors.length;

function random(max) {
	return Math.round(Math.random() * 1000) % max;
}

var id = 1;
var cache = {}; // Cache for memoization

function buildData(count) {
	var data = [];

	for (var i = 0; i < count; i++) {
		cache[id] = null;

		data.push({
			id: id++,
			label: adjectives[random(adjectivesLength)] + " " + colors[random(colorsLength)] + " " + nouns[random(nounsLength)]
		});
	}

	return data;
}

function run(input) {
	var data = input.data;
	cache = {};
	data.data = buildData(1000);

	return {
		data: data,
		view: (<View data={data}/>)
	};
}

function runLots(input) {
	var data = input.data;
	cache = {};
	data.data = buildData(10000);

	return {
		data: data,
		view: (<View data={data}/>)
	};
}

function add(input) {
	var data = input.data;
	data.data = data.data.concat(buildData(1000));

	return {
		data: data,
		view: (<View data={data}/>)
	};
}

function update(input) {
	var data = input.data;
	var dataData = data.data;

	for (var i = 0; i < dataData.length; i += 10) {
		var item = dataData[i];
		cache[item.id] = null;
		item.label += " !!!";
	}

	return {
		data: data,
		view: (<View data={data}/>)
	};
}

function clear(input) {
	var data = input.data;
	cache = {};
	data.data = [];

	return {
		data: data,
		view: (<View data={data}/>)
	};
}

function swap(input) {
	var data = input.data;
	var dataData = data.data;

	if (dataData.length > 998) {
		var tmp = dataData[1];
		dataData[1] = dataData[998];
		dataData[998] = tmp;
	}

	return {
		data: data,
		view: (<View data={data}/>)
	};
}

function remove(id) {
	return function removeHandler(input) {
		var data = input.data;
		var dataData = data.data;
		var index;

		for (var i = 0; i < dataData.length; i++) {
			if (dataData[i].id === id) {
				index = i;
			}
		}

		dataData.splice(index, 1);
		cache[id] = null;

		return {
			data: data,
			view: (<View data={data}/>)
		};
	};
}

function select(id) {
	return function selectHandler(input) {
		var data = input.data;
		cache[data.selected] = null; // Clear cache of previously selected row.
		data.selected = id;
		cache[id] = null; // Clear cache of newly selected row.

		return {
			data: data,
			view: (<View data={data}/>)
		};
	};
}

function Row(data) {
	var item = data.item;
	var id = item.id;

	return (
		<tr class={data.styleClass}>
			<td class="col-md-1">{id}</td>
			<td class="col-md-4">
				<a @click={select(id)}>{item.label}</a>
			</td>
			<td class="col-md-1">
				<a @click={remove(id)}>
					<span class="glyphicon glyphicon-remove" ariaset={{hidden: true}}></span>
				</a>
			</td>
			<td class="col-md-6"></td>
		</tr>
	);
}

function View(input) {
	var data = input.data;
	var dataData = data.data;
	var selected = data.selected;
	var rows = [];

	for (var i = 0; i < dataData.length; i++) {
		var item = dataData[i];
		var id = item.id;

		// Check for memoized row.
		var cached = cache[id];

		if (cached === null) {
			// If the row is not already in the cache, then store it in the cache using its id.
			rows.push((cache[id] = (<Row item={item} styleClass={id === selected ? "danger" : ""}/>)));
		} else {
			// If it is cached, then use the cached row.
			rows.push(cached);
		}
	}

	return (
		<div class="container">
			<div class="jumbotron">
				<div class="row">
					<div class="col-md-6">
						<h1>Moon</h1>
					</div>
					<div class="col-md-6">
						<div class="row">
							<div class="col-sm-6 smallpad">
								<button type="button" class="btn btn-primary btn-block" id="run" @click={run}>Create 1,000 rows</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button type="button" class="btn btn-primary btn-block" id="runlots" @click={runLots}>Create 10,000 rows</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button type="button" class="btn btn-primary btn-block" id="add" @click={add}>Append 1,000 rows</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button type="button" class="btn btn-primary btn-block" id="update" @click={update}>Update every 10th row</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button type="button" class="btn btn-primary btn-block" id="clear" @click={clear}>Clear</button>
							</div>
							<div class="col-sm-6 smallpad">
								<button type="button" class="btn btn-primary btn-block" id="swaprows" @click={swap}>Swap Rows</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<table class="table table-hover table-striped test-data">
				<tbody children={rows}></tbody>
			</table>
			<span class="preloadicon glyphicon glyphicon-remove" ariaset={{hidden: true}}></span>
		</div>
	);
}

Moon.use({
	data: Moon.data.driver({ data: [], selected: undefined }),
	view: Moon.view.driver("#main")
});

Moon.run(function(input) {
	return {
		view: (<View data={input.data}/>)
	};
});
