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
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    presets: [
      ['@babel/preset-react', {
        runtime: 'automatic',
        importSource: 'preact'
      }]
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
    // format: 'commonjs',
  },
  plugins,
});
