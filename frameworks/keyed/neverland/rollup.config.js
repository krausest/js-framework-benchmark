import resolve from 'rollup-plugin-node-resolve';
import includePaths from 'rollup-plugin-includepaths';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import {terser} from 'rollup-plugin-terser';

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
        "@ungap/create-content": "./node_modules/@ungap/degap/create-content.js",
        "@ungap/template-tag-arguments": "./node_modules/@ungap/degap/template-tag-arguments.js",
        "@ungap/template-literal": "./node_modules/@ungap/degap/template-literal.js",
        "@ungap/weakmap": "./node_modules/@ungap/degap/weakmap.js",
        "@ungap/weakset": "./node_modules/@ungap/degap/weakset.js",
        "@ungap/event": "./node_modules/@ungap/degap/event.js",
        "@ungap/essential-map": "./node_modules/@ungap/degap/essential-map.js",
        "@ungap/import-node": "./node_modules/@ungap/degap/import-node.js",
        "@ungap/trim": "./node_modules/@ungap/degap/trim.js"
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
