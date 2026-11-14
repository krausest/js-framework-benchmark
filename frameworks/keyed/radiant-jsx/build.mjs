import { build } from 'esbuild';

await build({
	entryPoints: ['src/main.ts'],
	bundle: true,
	minify: true,
	format: 'esm',
	target: 'es2022',
	outfile: 'dist/main.js',
	define: { 'process.env.NODE_ENV': '"production"' },
});
