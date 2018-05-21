const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');
const closure = require('rollup-plugin-closure-compiler-js');

rollup({
	input: 'src/main.es6.js',
	plugins: [
		buble(),
		closure({
			rewritePolyfills: false
		}),
	]
})
.then(bundle => bundle.write({
	file: 'dist/bundle.js',
	format: 'iife'
}))
.catch(err => console.log(err.stack));