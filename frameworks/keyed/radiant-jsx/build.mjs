import { build } from 'esbuild';

await build({
	entryPoints: ['src/main.js'],
	bundle: true,
	minify: true,
	format: 'esm',
	outfile: 'dist/main.js',
	jsx: 'automatic',
	jsxImportSource: '@ecopages/jsx',
	define: { 'process.env.NODE_ENV': '"production"' },
});
