import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const plugins = [
	babel({
		exclude: 'node_modules/**'
  }),
	resolve()
];

if (process.env.production) {
	plugins.push(terser());
}

export default {
	input: 'src/main.js',
	output: {
		file: 'dist/main.js',
		format: 'iife'
	},
	plugins
};
