"use strict";

const _ = require('lodash');
const dots = require('dot').process({
	path: './'
});
const fs = require('fs');

let results = {};
let frameworks = [];
let benchmarks = [];
let types = {};
let descriptions = new Map();

fs.readdirSync('./results').filter(file => file.endsWith('.json')).forEach(name => {
	let data = JSON.parse(fs.readFileSync('./results/' + name, {
		encoding:'utf-8'
	}));
	
	frameworks.push(data.framework);
	benchmarks.push(data.benchmark);
	types[data.benchmark] = data.type;
	descriptions.set(data.benchmark, data.description);

	results[data.framework] = results[data.framework] || {};
	results[data.framework][data.benchmark] = data;
});

frameworks = _.uniq(frameworks).sort((a,b) => {
	if (a=='vanillajs') {
		if (b=='vanillajs') return 0;
		return 1;
	} else if (b=='vanillajs') {
		if (a=='vanillajs') return 0;
		return -1;
	} else {
		if (a < b) return -1;
		else if (a == b) return 0;
		else return 1;
	}
});

benchmarks = _.uniq(benchmarks);

let cpuBenchmarks = benchmarks.filter(benchmark => types[benchmark] === 'cpu');
let memBenchmarks = benchmarks.filter(benchmark => types[benchmark] === 'memory');
let cpuBenchmarkCount = cpuBenchmarks.length;

let getValue = (framework, benchmark) => results[framework] && results[framework][benchmark];

let factors = frameworks.map(f => 1.0);

let generateBenchData = benchmarks => {
	let benches = [];
	benchmarks.forEach(benchmark => {
		let bench = {
			name: benchmark,
			description: descriptions.get(benchmark),
			tests: []
		};

		let values = [];
		frameworks.forEach(framework => {
			values.push(getValue(framework, benchmark));
		});

		let sorted = _.compact(values).map(data => {
			return data.mean;
		}).sort((a, b) => a - b);

		let min, top1, top3;

		if (sorted.length) {
			min = sorted[0];

			if (sorted.length === 1) {
				top1 = min;
			}
			else {
				let min = sorted[1];
				let max = sorted[sorted.length - 1];

				top1 = min * 1.33;
				top3 = min * 2.33;

				while (top1 > max) {
					top1 *= 0.8;
					top3 *= 0.8;
				}
				while (top3 > max) {
					top3 *= 0.8;
				}

				if (top1 < min) {
					top1 = min * 1.33;
				}
				if (top3 < min) {
					top3 = min * 2.33;
				}
			}
		}


		_.forEach(values, function (value, idx) {
			if (value) {
				let factor;
				if (types[benchmark] === 'cpu') {
					factor = Math.max(16, value.mean) / Math.max(16, min);

					factors[idx] = factors[idx] * factor;
				}
				else {
					factor = value.mean / min;
				}

				bench.tests.push({
					mean: value.mean,
					deviation: value.standardDeviation,
					factor: factor.toPrecision(3),
					class: value.mean <= top1 ? 'top1' : value.mean <= top3 ? 'top3' : 'top5'
				});
			}
			else {
				bench.tests.push(null);
			}
		});

		benches.push(bench);
	});
	return benches;
}

let cpubenches = generateBenchData(cpuBenchmarks);
let membenches = generateBenchData(memBenchmarks);

let geomMeans = factors.map(f => {
	let value = Math.pow(f, 1 / cpuBenchmarkCount).toPrecision(3);
	return {value, class: value < 1.5 ? 'top1' : value < 3.0 ? 'top3' : 'top5'}
});

fs.writeFileSync('./table.html', dots.table({
	frameworks: frameworks.map(framework => framework.replace('-v', ' v')),
	cpubenches,
	membenches,
	geomMeans
}), {
	encoding: 'utf8'
})
