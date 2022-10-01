import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const plugins = [
  babel({
    babelHelpers: 'bundled',
  }),
  resolve(),
  commonJS({
	  include: 'node_modules/**'
  }),
];

if (process.env.production) {
  plugins.push(terser({ output: { comments: false } }));
}

export default {
  input: 'src/Main.js',
  output: {
    file: 'dist/main.js',
    format: 'iife',
  },
  plugins,
};
