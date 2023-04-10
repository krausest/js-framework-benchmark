import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import million from 'million/compiler';

const TERSER_OPTIONS = {
  compress: {
    ecma: 5,
    inline: true,
    if_return: false,
    reduce_funcs: false,
    passes: 5,
    comparisons: false,
  },
  toplevel: true,
  mangle: true,
  module: true,
};

export default {
  input: 'src/main.jsx',
  output: {
    name: 'million',
    format: 'iife',
    file: 'dist/main.js',
    sourcemap: false,
  },
  watch: {
    clearScreen: false,
  },
  plugins: [
    resolve({
      preferBuiltins: false,
      extensions: ['.js', '.jsx'],
    }),
    million.rollup(),
    terser(TERSER_OPTIONS),
  ],
};
