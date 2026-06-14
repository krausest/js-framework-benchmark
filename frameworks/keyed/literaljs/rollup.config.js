import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const production = process.env.NODE_ENV === 'production';

export default {
	input: 'main.js',
	output: {
		file: 'dist/main.js',
		format: 'iife',
		name: 'app'
	},
	plugins: [
		resolve(),
		production && terser()
	].filter(Boolean)
};
