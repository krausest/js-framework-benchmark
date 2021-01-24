import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const plugins = [resolve(), commonjs(), terser()];

export default {
  input: 'tmp/src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
  },
  plugins
}
