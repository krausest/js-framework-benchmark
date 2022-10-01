import minifyHTML from 'rollup-plugin-minify-html-literals';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import includePaths from 'rollup-plugin-includepaths';

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
        '@ungap/create-content': 'node_modules/@ungap/degap/create-content.js'
      },
    }),
    nodeResolve(),
    terser()
  ],
  output: {
    esModule: false,
    file: 'dist/index.js',
    exports: 'named',
    format: 'iife',
    name: 'app'
  }
};


