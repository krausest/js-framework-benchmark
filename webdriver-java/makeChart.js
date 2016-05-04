var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var rgba = require('rgba-convert');
var child_process = require('child_process');

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

var data = {
	labels: [],
	datasets: []
};

var benches = [];
benchmarks.forEach(benchmark => {
	data.labels.push(benchmark);
});

let colors = [0x00AAA0, 0x8ED2C9, 0x44B3C2, 0xF1A94E, 0xE45641, 0x7CE8BF, 0x5D4C46, 0x7B8D8E, 0xA9FFB7, 0xF4D00C, 0x462066];

function rgbaStr(col) {
	return 'rgba('+col.r+','+col.g+','+col.b+','+col.a+')';
}

frameworks.forEach((framework, index) => {

	let color = rgba.obj(colors[index % colors.length]);
	let fillColor = Object.assign({}, color, {a: 0.5});
	let strokeColor = Object.assign({}, color, {a: 0.8});
	let highlightFill = Object.assign({}, color, {a: 0.7});
	let highlightStroke = Object.assign({}, color, {a: 0.9});

	let dataset = {
		label: framework.replace('-v', ' v').replace('/dist', ''),
		fillColor: rgbaStr(fillColor),
		strokeColor: rgbaStr(strokeColor),
		highlightFill: rgbaStr(highlightFill),
		highlightStroke: rgbaStr(highlightStroke),
		data: []
	};
	dataset.data = benchmarks.map(benchmark => getValue(framework, benchmark));

	data.datasets.push(dataset);
});

fs.writeFileSync('./chart.data.js', "var data = "+JSON.stringify(data), {
	encoding: 'utf8'
})