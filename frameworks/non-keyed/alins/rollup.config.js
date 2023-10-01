/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-07 11:54:42
 * @Description: Coding something
 */
import alins from 'rollup-plugin-alins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const plugins = [resolve(), commonjs(), alins()];

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
