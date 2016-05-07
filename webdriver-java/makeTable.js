"use strict";

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

let getValue = (framework, benchmark) => results.get(framework).results.find(r => r.benchmark === benchmark).avg;

var dots = require('dot').process({
	path: './'
});

var factors = frameworks.map(f => 1.0);

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

	_.forEach(values, function(value, idx) {
		let factor = Math.max(16,value)/Math.max(16,min);
		factors[idx] = factors[idx] * factor;
		bench.tests.push({
			value,
			factor : factor.toPrecision(3),
			class: value <= top1 ? 'top1' : value <= top3 ? 'top3' : 'top5'
		});
	})
	benches.push(bench);
});

let geomMeans = factors.map(f => {
	let value = Math.pow(f, 1/benchmarks.length).toPrecision(3);
	return {value, class: value < 1.5 ? 'top1' : value < 3.0 ? 'top3' : 'top5'}
});

fs.writeFileSync('./table.html', dots.table({
	frameworks: [''].concat(frameworks).map(framework => framework.replace('-v', ' v').replace('/dist', '')),
	benches,
	geomMeans
}), {
	encoding: 'utf8'
})