import resolve from 'rollup-plugin-node-resolve';
import surplus from 'rollup-plugin-surplus';
import { terser } from 'rollup-plugin-terser';

const plugins = [
	surplus(),
	resolve({ extensions: ['.js', '.jsx'] })
];

if (process.env.production) {
	plugins.push(terser({
		parse: {
		  	ecma: 8,
		},
		compress: {
		  	ecma: 5,
		  	inline: true,
		  	reduce_funcs: false,
		  	passes: 5,
		},
		output: {
		  	ecma: 5,
		  	comments: false,
		},
		toplevel: true,
		module: true,
	}));
}

export default {
	input: 'es/main.js',
	output: {
		file: 'dist/main.js',
		format: 'iife'
	},
	plugins
};