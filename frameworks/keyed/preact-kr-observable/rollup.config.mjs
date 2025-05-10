import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';

const plugins = [
  commonjs(),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
    presets: [
      // '@babel/preset-env',
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
  }),
  alias({
    entries:[
      { find: 'react', replacement: 'preact/compat' },
      { find: 'react-dom', replacement: 'preact/compat' },
      { find: 'react/jsx-runtime', replacement: 'preact/compat' },
      { find: 'use-sync-external-store', replacement: 'preact/compat' }
    ]
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
    // format: 'commonjs',
  },
  plugins,
});
