import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const plugins = [
	babel({
    exclude: 'node_modules/**'
  }),
	resolve({ extensions: ['.js', '.jsx'] }),
	commonjs({
		include: 'node_modules/**'
	})
];

if (process.env.production) {
	plugins.push(uglify());
}

export default {
	input: 'src/Main.js',
	output: {
		file: 'dist/main.js',
		format: 'iife'
	},
	plugins
};