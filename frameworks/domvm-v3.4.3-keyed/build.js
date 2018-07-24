const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');
const ClosureCompiler = require('closure-compiler-js-prebuilt');
const fs = require('fs');

rollup({
	input: 'src/main.es6.js',
	plugins: [
		buble()
	]
}).then(bundle => {
	return bundle.write({
		file: 'dist/bundle.js',
		format: 'iife'
	})
}).then(() => {
	const flags = {
		jsCode: [{src: fs.readFileSync('dist/bundle.js', 'utf8')}],
		languageIn: 'ECMASCRIPT5_STRICT',
		languageOut: 'ECMASCRIPT5',
		compilationLevel: 'SIMPLE',
		rewritePolyfills: false,
	};

	const compiled = new ClosureCompiler(flags).run().compiledCode;

	fs.writeFileSync('dist/bundle.min.js', compiled, 'utf8');
}).catch(err => console.log(err.stack));