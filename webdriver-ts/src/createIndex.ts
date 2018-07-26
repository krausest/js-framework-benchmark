import * as fs from 'fs';
import {JSONResult, config, initializeFrameworks} from './common'
import {BenchmarkType, Benchmark, benchmarks} from './benchmarks'

let frameworks = initializeFrameworks();

const dots = require('dot').process({
	path: './'
});

fs.writeFileSync('../index.html', dots.index({
	frameworks
}), {
	encoding: 'utf8'
})
