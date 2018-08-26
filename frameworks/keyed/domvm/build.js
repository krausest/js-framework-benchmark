const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');
const UglifyJS = require('uglify-js');
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
	// from docs (https://github.com/mishoo/UglifyJS2)
	const compressDefaults = {
		arguments: true,
		booleans: true,
		collapse_vars: true,
		comparisons: true,
		conditionals: true,
		dead_code: true,
		directives: true,
		drop_console: false,
		drop_debugger: true,
		evaluate: true,
		expression: false,
		global_defs: {},
		hoist_funs: false,
		hoist_props: true,
		hoist_vars: false,
		if_return: true,
		inline: 3,
		join_vars: true,
		keep_fargs: true,
		keep_fnames: false,
		keep_infinity: false,
		loops: true,
		negate_iife: true,
		passes: 1,
		properties: true,
		pure_funcs: null,
		pure_getters: "strict",
		reduce_funcs: true,
		reduce_vars: true,
		sequences: true,
		side_effects: true,
		switches: true,
		toplevel: false,
		top_retain: null,
		typeofs: true,
		unsafe: false,
		unsafe_comps: false,
		unsafe_Function: false,
		unsafe_math: false,
		unsafe_proto: false,
		unsafe_regexp: false,
		unsafe_undefined: false,
		unused: true,
		warnings: false,
	};

	const opts = {
		compress: Object.assign({}, compressDefaults, {
			booleans: false,
			inline: 0,
			keep_fargs: false,
			hoist_props: false,
			loops: false,
			reduce_funcs: false,
			unsafe: true,
			unsafe_math: true,
		}),
	};

	const compiled = UglifyJS.minify(fs.readFileSync('dist/bundle.js', 'utf8'), opts).code;

	fs.writeFileSync('dist/bundle.min.js', compiled, 'utf8');
}).catch(err => console.log(err.stack));