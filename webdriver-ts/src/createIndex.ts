import * as fs from 'fs';
import {JSONResult, config, frameworks} from './common'
import {BenchmarkType, Benchmark, benchmarks} from './benchmarks'

const dots = require('dot').process({
	path: './'
});

fs.writeFileSync('../index.html', dots.index({
	frameworks
}), {
	encoding: 'utf8'
})
