import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const plugins = [
  resolve({ browser: true }),
  svelte({
    emitCss: false,
  }),
];

if (process.env.production) {
  plugins.push(terser());
}

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'iife',
    name: 'main'
  },
  plugins
};
