import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import endorphin from '@endorphinjs/rollup-plugin-endorphin';

export default {
	input: './src/app.js',
	plugins: [
		resolve(),
		commonjs(),
		endorphin(),
		process.env.production && terser()
	],
	output: [{
		format: 'iife',
		file: './dist/main.js',
		sourcemap: true
	}]
};
