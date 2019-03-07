'use strict';

import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from 'rollup-plugin-commonjs';

export default [{
  input: 'app.js',
  output: {
    file: 'dist/app.min.js',
    format: 'iife',
    name: 'app',
    sourcemap: true,
    globals: {
      '@sifrr/dom': 'Sifrr.Dom',
      '@sifrr/fetch': 'Sifrr.Fetch'
    }
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    babel(),
    terser({
      keep_classnames: true
    })
  ],
},{
  input: 'elements.js',
  output: {
    file: 'dist/elements.min.js',
    format: 'iife',
    name: 'app',
    sourcemap: true,
    globals: {
      '@sifrr/dom': 'Sifrr.Dom',
      '@sifrr/fetch': 'Sifrr.Fetch'
    }
  },
  external: [ '@sifrr/dom' ],
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    babel(),
    terser({
      keep_classnames: true
    })
  ],
}]
