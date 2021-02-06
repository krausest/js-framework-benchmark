import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';

const plugins = [resolve(), commonjs(), serve()];

export default {
  input: 'tmp/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
  },
  plugins
}