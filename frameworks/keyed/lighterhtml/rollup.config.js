import minifyHTML from 'rollup-plugin-minify-html-literals';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  plugins: [
    minifyHTML(),
    resolve(),
    replace({
      'tta.apply(null, arguments)': 'arguments',
      delimiters: ['', '']
    }),
    babel({
      plugins: [
        ['remove-ungap', {
          exclude: [
            '@ungap/create-content'
          ]
        }]
      ],
    }),
    terser()
  ],
  context: 'null',
  moduleContext: 'null',
  output: {
    file: 'dist/index.js',
    format: 'iife',
    name: 'app'
  }
};
