import * as _ from 'lodash'
import * as fs from 'fs';
import {JSONResult, config} from './common'
import {BenchmarkType, Benchmark, benchmarks} from './benchmarks'

const dots = require('dot').process({
	path: './'
});

let results: Map<string, Map<string, JSONResult>> = new Map();
let frameworks: Array<string> = [];

fs.readdirSync('./results').filter(file => file.endsWith('.json')).forEach(name => {
	let data = <JSONResult>JSON.parse(fs.readFileSync('./results/' + name, {
		encoding:'utf-8'
	}));

	frameworks.push(data.framework);

	if (!results.has(data.framework)) results.set(data.framework, new Map());
	results.get(data.framework).set(data.benchmark, data);
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

let cpuBenchmarks = benchmarks.filter(benchmark => benchmark.type === BenchmarkType.CPU);
let memBenchmarks = benchmarks.filter(benchmark => benchmark.type === BenchmarkType.MEM);
let cpuBenchmarkCount = cpuBenchmarks.length;

let getValue = (framework:string, benchmark:string) => results.has(framework) && results.get(framework).get(benchmark);

let factors = frameworks.map(f => 1.0);

function color(factor:number): string {
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

interface TestData {
	mean:string,
	deviation: string,
	factor: string,
	styleClass: string
}

class BenchResultList {
	tests: Array<TestData>;
	name: string;
	description: string;

	constructor(benchmark: Benchmark) {
		this.tests = [];
		this.name = benchmark.label;
		this.description = benchmark.description;
	}
}

let generateBenchData = (benchmarks: Array<Benchmark>) => {
	let benches: Array<BenchResultList> = [];
	benchmarks.forEach((benchmark) => {
		let bench = new BenchResultList(benchmark);

		let values: Array<JSONResult> = [];
		frameworks.forEach(framework => {
			values.push(getValue(framework, benchmark.id));
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
				try {
					let factor: number;
					if (benchmark.type === BenchmarkType.CPU) {
						factor = value.mean / min;
						factors[idx] = factors[idx] * factor;
					}
					else {
						factor = value.mean / min;
					}

					bench.tests.push({
						mean: value.mean.toFixed(2),
						deviation: value.standardDeviation.toFixed(2),
						factor: factor.toFixed(2),
						styleClass: color(factor)
					});
				} catch (err) {
					console.log(`error in ${benchmark} ${JSON.stringify(value)}`,err);
				}
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
	let value = Math.pow(f, 1 / cpuBenchmarkCount);
	return {value: value.toPrecision(3), styleClass: color(value)}
});

fs.writeFileSync('./table.html', dots.table({
	frameworks: frameworks.map(framework => framework.replace('-v', ' v')),
	cpubenches,
	membenches,
	geomMeans
}), {
	encoding: 'utf8'
})
