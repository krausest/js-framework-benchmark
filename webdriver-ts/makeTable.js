"use strict";

const _ = require('lodash');
const dots = require('dot').process({
	path: './'
});
const fs = require('fs');

let makeInfo = (name,description) => ({name, description});

const WARMUP_COUNT = 5;

let infos = {
	"01_run1k": makeInfo("create rows", "Duration for creating 1000 rows after the page loaded."),
	"02_replace1k": makeInfo("replace all rows", "Duration for updating all 1000 rows of the table (with "+WARMUP_COUNT+" warmup iterations)."),
	"03_update10th1k": makeInfo("partial update", "Time to update the text of every 10th row (with "+WARMUP_COUNT+" warmup iterations)."),
	"04_select1k": makeInfo("select row", "Duration to highlight a row in response to a click on the row. (with "+WARMUP_COUNT+" warmup iterations)."),
	"05_swap1k": makeInfo("swap rows", "Time to swap 2 rows on a 1K table. (with "+WARMUP_COUNT+" warmup iterations)."),
	"06_remove-one-1k": makeInfo("remove row", "Duration to remove a row. (with "+WARMUP_COUNT+" warmup iterations)."),
	"07_create10k": makeInfo("create many rows", "Duration to create 10,000 rows"),
	"08_create1k-after10k": makeInfo("append rows to large table", "Duration for adding 1000 rows on a table of 10,000 rows."),
	"09_clear10k": makeInfo("clear rows", "Duration to clear the table filled with 10.000 rows."),
	"10_clear-2nd-time10k": makeInfo("clear rows a 2nd time", "Time to clear the table filled with 10.000 rows. But warmed up with only one iteration."),

	"21_ready-memory": makeInfo("ready memory", "Memory usage after page load."),
	"22_run-memory": makeInfo("run memory", "Memory usage after adding 1000 rows."),
}

let results = {};
let frameworks = [];
let benchmarks = [];
let types = {};

fs.readdirSync('./results').filter(file => file.endsWith('.json')).forEach(name => {
	let data = JSON.parse(fs.readFileSync('./results/' + name, {
		encoding:'utf-8'
	}));
	
	frameworks.push(data.framework);
	benchmarks.push(data.benchmark);
	types[data.benchmark] = data.type;

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

function color_discrete(factor) {
	if (factor < 1.5) {
		let r = (80 + 2*50*(factor-1.0)).toFixed(0);
		return `rgb(${r}, 200, 124)`
	} else if (factor < 2.5) {
		let g = (240 - 50*(factor-1.5)).toFixed(0);
		return `rgb(255, ${g}, 132)`
	} else {
		let o = (105 - Math.min(50*(factor-2.5),50)).toFixed(0);
		return `rgb(249, ${o}, ${o})`
	}
}

function color(factor) {
	if (factor < 2.0) {
		let a = (factor - 1.0);
		let r = (1.0-a)* 99 + a * 255;
		let g = (1.0-a)* 191 + a * 236;
		let b = (1.0-a)* 124 + a * 132;
		return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`
	} else  {
		let a = Math.min((factor - 2.0) / 2.0, 1.0);
		let r = (1.0-a)* 255 + a * 249;
		let g = (1.0-a)* 236 + a * 105;
		let b = (1.0-a)* 132 + a * 108;
		return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`
	}
}


let generateBenchData = benchmarks => {
	let benches = [];
	benchmarks.forEach(benchmark => {
		let bench = {
			name: infos[benchmark].name,
			description: infos[benchmark].description,
			tests: []
		};

		let values = [];
		frameworks.forEach(framework => {
			values.push(getValue(framework, benchmark));
		});

		let sorted = _.compact(values).map(data => {
			return data.mean;
		}).sort((a, b) => a - b);

		let min = 1.0;

		if (sorted.length) {
			min = sorted[0];
		}

		_.forEach(values, function (value, idx) {
			if (value) {
				let factor;
				if (types[benchmark] === 'cpu') {
					// Clamp to 1 fps
					factor = Math.max(16, value.mean) / Math.max(16, min);
					factors[idx] = factors[idx] * factor;
				}
				else {
					factor = value.mean / min;
				}

				bench.tests.push({
					mean: value.mean.toFixed(2),
					deviation: value.standardDeviation.toFixed(2),
					factor: factor.toFixed(2),
					class: color(factor)
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
	return {value, class: color(value)}
});

fs.writeFileSync('./table.html', dots.table({
	frameworks: frameworks.map(framework => framework.replace('-v', ' v')),
	cpubenches,
	membenches,
	geomMeans
}), {
	encoding: 'utf8'
})
