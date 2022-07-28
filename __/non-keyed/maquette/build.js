const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');
const uglify = require('rollup-plugin-uglify');
const commonjs = require('rollup-plugin-commonjs');

rollup({
	input: 'src/main.es6.js',
	plugins: [
		commonjs(),
		buble(),
//  Somehow uglify makes erronous code, needs investigation
//		uglify(),
	]
}).then(bundle => bundle.write({
	file: 'dist/bundle.js',
	format: 'iife'
})).catch(err => console.log(err.stack));