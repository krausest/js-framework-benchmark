import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'tmp/main.aot.js',
  dest: 'dist/bundle.js',
  sourceMap: false,
  format: 'iife',
  moduleName: 'ng4App',
  plugins: [
    nodeResolve({
      jsnext: true,
      module: true
    }),
    commonjs(),
  ]
}