const commonjsPlugin = require('rollup-plugin-commonjs');
const nodeResolvePlugin = require('rollup-plugin-node-resolve');
const babelPlugin = require('rollup-plugin-babel');
const path = require('path');
const replace = require('rollup-plugin-replace');
const alias = require('rollup-plugin-alias');

const isProduction = process.env.production;

const extensions = ['.mjs', '.js', '.jsx'];

// see below for details on the options
const plugins = [
  nodeResolvePlugin({
    preferBuiltins: false,
    extensions: extensions
  }),
  replace({
    'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development'),
    sourcemap: false
  }),
  babelPlugin({
    exclude: 'node_modules/**',
    sourceMaps: false
  }),
  commonjsPlugin({
    sourceMap: false,
    extensions: extensions
  }),
];


export default {
  input: path.join(__dirname, 'src/main.es6.js'),
  output: {
    name: 'glasgow',
    format: 'iife',
    file: path.join(__dirname, 'dist', 'main.js'),
    sourcemap: false
  },
  plugins: plugins
}
