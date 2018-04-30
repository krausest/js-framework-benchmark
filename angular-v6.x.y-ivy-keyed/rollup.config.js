import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'tmp/src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
  },
  moduleName: 'ngApp',
  plugins: [
    nodeResolve({
      jsnext: true,
      module: true
    }),
    commonjs(),
  ]
}