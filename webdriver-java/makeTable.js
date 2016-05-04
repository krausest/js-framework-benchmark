var _ = require('lodash');
var fs = require('fs');

var files = fs.readdirSync("./results")
	.filter(file => file.endsWith('.txt'));

let results = new Map();
let frameworks = [];

files.map(f => {return {name: f, data: fs.readFileSync("./results/"+f, {encoding:"utf-8"})};})
	.forEach(({name, data}) => {
		let n = name.substring(0,name.length-4);
		results.set(n, Function("return "+data)());
		frameworks.push(n);
	});

let benchmarks = results.values().next().value.results.map(r => r.benchmark);

let getValue = (framework, benchmark) =>results.get(framework).results.find(r => r.benchmark === benchmark).avg;

var dots = require('dot').process({
	path: './'
});

var benches = [];
benchmarks.forEach(benchmark => {
	var bench = {
		name: benchmark,
		tests: []
	};
	
	var values = [];
	frameworks.forEach(framework => {
		values.push(getValue(framework, benchmark));
	});
	var sorted = values.slice(0).sort(function(a, b) {
		return a - b;
	});
	var min = sorted[0];
	var max = sorted[sorted.length - 1];
	
	var top1 = min * 1.33;
	var top3 = min * 2.33;

	while(top1 >= max) {
		top1 *= 0.8;
		top3 *= 0.8;
	}
	while(top3 >= max) {
		top3 *= 0.8;
	}

	_.forEach(values, function(value) {
		if(value <= top1) {
			bench.tests.push({
				value: value,
				class: 'top1'
			});
		}
		else if(value <= top3) {
			bench.tests.push({
				value: value,
				class: 'top3'
			});
		}
		else {
			bench.tests.push({
				value: value,
				class: 'top5'
			});
		}
	})
	benches.push(bench);
});

fs.writeFileSync('./table.html', dots.table({
	frameworks: [''].concat(frameworks).map(framework => framework.replace('-v', ' v').replace('/dist', '')),
	benches: benches
}), {
	encoding: 'utf8'
})