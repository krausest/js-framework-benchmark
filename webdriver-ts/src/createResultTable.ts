import * as _ from 'lodash'
import * as fs from 'fs';
import {JSONResult, config, frameworks, FrameworkData} from './common'
import {BenchmarkType, Benchmark, benchmarks} from './benchmarks'

const dots = require('dot').process({
	path: './'
});

let frameworkMap = new Map<string, FrameworkData>();
frameworks.map(f => frameworkMap.set(f.name, f));

let results: Map<string, Map<string, JSONResult>> = new Map();

fs.readdirSync('./results').filter(file => file.endsWith('.json')).forEach(name => {
	let data = <JSONResult>JSON.parse(fs.readFileSync('./results/' + name, {
		encoding:'utf-8'
	}));
	
	if (!frameworkMap.has(data.framework)) {
		console.log("WARN: No entry in commons.ts for "+data.framework+". Data will not appear in result table.");
	} else {
		if (!results.has(data.framework)) results.set(data.framework, new Map());
		results.get(data.framework).set(data.benchmark, data);
	}
});

let cpuBenchmarks = benchmarks.filter(benchmark => benchmark.type === BenchmarkType.CPU);
let memBenchmarks = benchmarks.filter(benchmark => benchmark.type === BenchmarkType.MEM);
let cpuBenchmarkCount = cpuBenchmarks.length;

let getValue = (framework:string, benchmark:string) => results.has(framework) && results.get(framework).get(benchmark);

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

interface SearchFunc {
    (source: string, subString: string): boolean;
}

interface FrameworkPredicate {
	(framework: FrameworkData) : boolean;
}

let generateBenchData = (benchmarks: Array<Benchmark>, frameworkPredicate: FrameworkPredicate, referenceName: string) => {
	let benches: Array<BenchResultList> = [];

	let filteredFrameworks = frameworks.filter(f => frameworkPredicate(f)).slice();

	let sortedFrameworks = filteredFrameworks.sort((a:FrameworkData,b:FrameworkData) => {
		if (a.name==referenceName) {
			if (b.name==referenceName) return 0;
			console.log("found reference name", referenceName);
			return 1;
		} else if (b.name==referenceName) {
			if (a.name==referenceName) return 0;
			console.log("found reference name", referenceName);
			return -1;
		} else {
			if (a.name < b.name) return -1;
			else if (a.name == b.name) return 0;
			else return 1;
		}
	});

	let frameworkNames = sortedFrameworks.map(framework => framework.name.replace('-v', ' v')) // .replace(/-keyed$|-non-keyed$/, ''))
	let factors = sortedFrameworks.map(f => 1.0);

	benchmarks.forEach((benchmark) => {
		let bench = new BenchResultList(benchmark);

		let values: Array<JSONResult> = [];
		sortedFrameworks.forEach(framework => {
			if (frameworkPredicate(framework)) {
				values.push(getValue(framework.name, benchmark.id));
			}
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
	let geomMeans = factors.map(f => {
		let value = Math.pow(f, 1 / cpuBenchmarkCount);
		return {value: value.toPrecision(3), styleClass: color(value)}
	});
	return {
		frameworks: frameworkNames,
		benches,
		geomMeans
	}
}

function frameworkPredicateKeyed(nonKeyed : boolean): FrameworkPredicate {
	return (framework: FrameworkData) => {return framework.nonKeyed === nonKeyed;};
}
let cpubenchesNonKeyed = generateBenchData(cpuBenchmarks, frameworkPredicateKeyed(true), 'vanillajs');
let membenchesNonKeyed = generateBenchData(memBenchmarks, frameworkPredicateKeyed(true), 'vanillajs');
let cpubenchesKeyed = generateBenchData(cpuBenchmarks, frameworkPredicateKeyed(false), 'vanillajs-keyed'); // react
let membenchesKeyed = generateBenchData(memBenchmarks, frameworkPredicateKeyed(false), 'vanillajs-keyed');

fs.writeFileSync('./table.html', dots.table({
	data: [
	{
		label: 'Keyed results',
		description: `Keyed implementations create an association between the domain data and a dom element
		by assigning a 'key'. If data changes the dom element with that key will be updated.
		In consequence inserting or deleting an element in the data array causes a corresponding change to the dom. 		 
		`,
		cpubenches: cpubenchesKeyed,
		membenches: membenchesKeyed
	},		
	{
		label: 'Non keyed results',
		description: `Non keyed implementations are allowed to reuse existing dom elements.
		In consequence inserting or deleting an element in the data array might append after or delete the last table row
		and update the contents of all elements after the inserting or deletion index. 
		This can perform better, but can cause problems if dom state is modified externally.
		`,
		cpubenches: cpubenchesNonKeyed,
		membenches: membenchesNonKeyed
	}]
}), {
	encoding: 'utf8'
})
