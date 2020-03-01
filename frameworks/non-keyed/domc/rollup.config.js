'use strict';

import * as path from 'path';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/app.js',
  output: {
    file: 'dist/app.min.js',
    format: 'iife',
    name: 'app',
    sourcemap: true,
  },
  plugins: [
    resolve({
      module: true,
      jsnext: true,
      browser: true,
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        [ "@babel/preset-env", {
          "targets": {
            "browsers": ["last 1 chrome versions"]
          }
        }]
      ],
      plugins: [
        "@babel/plugin-external-helpers"
      ],
      runtimeHelpers: true,
      babelrc: false,
    }),
    terser()
  ],
}
