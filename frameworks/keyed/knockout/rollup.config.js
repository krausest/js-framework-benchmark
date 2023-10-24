import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const isProd = process.env.production

export default {
	input: 'src/Main.js',
	output: {
		file: 'dist/main.js',
		format: 'iife'
	},
	plugins: [resolve(),commonjs(), isProd && terser()]
};