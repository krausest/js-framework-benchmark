import resolve from 'rollup-plugin-node-resolve';
import surplus from 'rollup-plugin-surplus';
import uglify from 'rollup-plugin-uglify';

const plugins = [
	surplus(),
	resolve({ extensions: ['.js', '.jsx'] })
];

if (process.env.production) {
	plugins.push(uglify());
}

export default {
	input: 'es/main.js',
	output: {
		file: 'dist/main.js',
		format: 'iife'
	},
	plugins
};