import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const plugins = [
  commonjs(),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
    presets: [
      '@babel/preset-env',
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
  }),
  nodeResolve({ extensions: ['.js', '.jsx'] }),
];

if (process.env.production) {
  plugins.push(terser());
}

export default defineConfig({
  input: 'src/Main.jsx',
  output: {
    file: 'dist/main.js',
    format: 'iife',
  },
  plugins,
});
