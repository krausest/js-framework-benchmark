import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const plugins = [
	resolve(),
	commonjs({
    include: 'node_modules/**'
	})
];

if (process.env.production) {
	plugins.push(terser());
}

export default {
	input: 'src/Main.js',
	output: {
		file: 'dist/main.js',
		format: 'iife'
	},
	plugins
};