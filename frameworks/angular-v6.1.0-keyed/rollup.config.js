import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'tmp/src/main.js',
  dest: 'dist/bundle.js',
  format: 'iife',
  moduleName: 'ngApp',
  plugins: [
    nodeResolve({
      jsnext: true,
      module: true
    }),
    commonjs(),
  ]
}