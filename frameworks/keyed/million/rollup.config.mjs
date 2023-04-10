import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { URL } from 'url';
import million from 'million/compiler';

const plugins = [
  resolve({
    preferBuiltins: false,
    extensions: ['.js', '.jsx'],
  }),
  million.rollup(),
  terser({
    parse: {
      ecma: 8,
    },
    compress: {
      ecma: 5,
      inline: true,
      if_return: false,
      reduce_funcs: false,
      passes: 5,
      comparisons: false,
    },
    output: {
      ecma: 5,
      comments: false,
    },
    toplevel: true,
    module: true,
  }),
];

export default {
  input: new URL('src/main.jsx', import.meta.url).pathname,
  output: {
    name: 'million',
    format: 'iife',
    file: new URL('dist/main.js', import.meta.url).pathname,
    sourcemap: false,
  },
  plugins,
};
