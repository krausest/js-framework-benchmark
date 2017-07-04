const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');
const uglify = require('rollup-plugin-uglify');
const commonjs = require('rollup-plugin-commonjs');

rollup({
	entry: 'src/main.es6.js',
	plugins: [
		commonjs(),
		buble(),
		uglify(),
	]
}).then(bundle => bundle.write({
	dest: 'dist/bundle.js',
	format: 'iife'
})).catch(err => console.log(err.stack));