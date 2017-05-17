/*eslint indent:0 quotes:0*/
import resolve from 'rollup-plugin-node-resolve'

export default {
  entry: './src/main.js',
  format: 'iife',
  dest: './dist/main.js',
  plugins: [
    resolve()
  ]
}
