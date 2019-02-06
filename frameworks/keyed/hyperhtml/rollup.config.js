"use strict";

import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/index.js',
  plugins: [
    resolve({module: true}),
    terser()
  ],
  context: 'null',
  moduleContext: 'null',
  output: {
    file: 'dist/index.min.js',
    format: 'iife',
    name: 'app'
  }
};
