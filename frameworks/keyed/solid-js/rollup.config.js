import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const plugins = [
	babel({
    exclude: 'node_modules/**'
  }),
	resolve({ extensions: ['.js', '.jsx'] })
];

if (process.env.production) {
	plugins.push(uglify());
}

export default {
	input: 'src/main.js',
	output: {
		file: 'dist/main.js',
		format: 'iife'
	},
	plugins
};