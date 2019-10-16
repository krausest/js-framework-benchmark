import resolve from 'rollup-plugin-node-resolve'
import minifyHTML from 'rollup-plugin-minify-html-literals'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    format: 'iife',
    name: 'naiv',
    file: 'dist/main.js'
  },
  plugins: [
    resolve(),
    minifyHTML(),
    terser()
  ]
}
