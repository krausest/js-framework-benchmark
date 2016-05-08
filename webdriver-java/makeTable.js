"use strict";

const _ = require('lodash');
const dots = require('dot').process({
	path: './'
});
const fs = require('fs');

let results = {};
let frameworks = [];
let benchmarks = [];

fs.readdirSync('./results').filter(file => file.endsWith('.json')).forEach(name => {
	let data = JSON.parse(fs.readFileSync('./results/' + name, {
		encoding:'utf-8'
	}));
	
	frameworks.push(data.framework);
	benchmarks.push(data.benchmark);
	
	results[data.framework] = results[data.framework] || {};
	results[data.framework][data.benchmark] = data;
});

frameworks = _.uniq(frameworks);
benchmarks = _.uniq(benchmarks);

let getValue = (framework, benchmark) => results[framework] && results[framework][benchmark];

let factors = frameworks.map(f => 1.0);

let benches = [];
benchmarks.forEach(benchmark => {
	let bench = {
		name: benchmark,
		tests: []
	};
	
	let values = [];
	frameworks.forEach(framework => {
		values.push(getValue(framework, benchmark));
	});
	
	let sorted = _.compact(values).map(data => {
		return data.geometricMean;
	}).sort((a, b) => a - b);
	
	let min, top1, top3;
	
	if(sorted.length) {
		min = sorted[0];
		
		if(sorted.length === 1) {
			top1 = min;
		}
		else {
			let min = sorted[1];
			let max = sorted[sorted.length - 1];
			
			top1 = min * 1.33;
			top3 = min * 2.33;
		
			while(top1 >= max) {
				top1 *= 0.8;
				top3 *= 0.8;
			}
			while(top3 >= max) {
				top3 *= 0.8;
			}
		}
	}

	_.forEach(values, function(value, idx) {
		if(value) {
			let factor = Math.max(16,value.geometricMean)/Math.max(16,min);
			factors[idx] = factors[idx] * factor;
			bench.tests.push({
				mean: value.geometricMean,
				deviation: value.standardDeviation,
				factor : factor.toPrecision(3),
				class: value.geometricMean <= top1 ? 'top1' : value.geometricMean <= top3 ? 'top3' : 'top5'
			});
		}
		else {
			bench.tests.push(null);
		}
	})
	benches.push(bench);
});

let geomMeans = factors.map(f => {
	let value = Math.pow(f, 1/benchmarks.length).toPrecision(3);
	return {value, class: value < 1.5 ? 'top1' : value < 3.0 ? 'top3' : 'top5'}
});

fs.writeFileSync('./table.html', dots.table({
	frameworks: [''].concat(frameworks).map(framework => framework.replace('-v', ' v')),
	benches,
	geomMeans
}), {
	encoding: 'utf8'
})