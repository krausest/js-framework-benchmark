'use strict';

import * as path from 'path';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import minifyliterals from 'rollup-plugin-minifyliterals';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'app.js',
  output: {
    file: 'dist/app.min.js',
    format: 'umd',
    name: 'app',
    sourcemap: true
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    babel(),
    terser()
  ],
}
