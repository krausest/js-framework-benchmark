import { build } from 'esbuild';
import { exodra } from 'esbuild-plugin-exodra';

await build({
    entryPoints: ['src/main.tsx'],
    bundle: true,
    minify: true,
    format: 'iife',
    target: 'es2022',
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [exodra()],
    outfile: 'dist/main.js',
});
