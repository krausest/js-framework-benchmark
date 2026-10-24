import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import terser from '@rollup/plugin-terser';
import { optimizer } from '@knno/jsx-optimizer/rollup';

const TERSER_OPTIONS = {
	module: true,
	compress: { passes: 3 },
	mangle: true,
};

export default {
	input: 'src/main.tsx',
	output: { file: 'dist/main.js', format: 'iife' },
	plugins: [
		optimizer(),
		esbuild({
			jsx: 'automatic',
			jsxImportSource: '@knno/jsx',
			target: 'esnext',
		}),
		resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
		process.env.production && terser(TERSER_OPTIONS),
	].filter(Boolean),
};
