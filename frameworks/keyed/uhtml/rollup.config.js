import minifyHTML from 'rollup-plugin-minify-html-literals';
import resolve from 'rollup-plugin-node-resolve';
import includePaths from 'rollup-plugin-includepaths';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  plugins: [
    minifyHTML({
      options: {
        minifyOptions: {
          keepClosingSlash: true
        }
      }
    }),
    includePaths({
      include: {
        '@ungap/create-content': './node_modules/@ungap/degap/create-content.js'
      },
    }),
    resolve(),
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
