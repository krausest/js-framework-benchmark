import path from 'path';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import alias from 'rollup-plugin-alias';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'tmp/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    alias({
      '@angular/compiler': path.resolve(__dirname, './tmp/empty-compiler.js'),
    }),
    nodeResolve({
      module: true,
    }),
    replace({
      'ngDevMode': 'false',
    }),
    terser(),
  ]
}
