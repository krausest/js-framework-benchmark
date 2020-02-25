import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import React from 'react';
import ReactDom from 'react-dom';

export default {
  input: 'src/Main.bs.js',
  output: {
    name: 'jfb',
    file: 'dist/main.js',
    format: 'iife',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve(),
    commonjs({
      namedExports: {
        react: Object.keys(React),
        'react-dom': Object.keys(ReactDom),
      },
    }),
    ...(process.env.production ? [terser()] : []),
  ],
};
