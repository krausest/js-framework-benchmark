import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'

export default {
  input: 'src/index.jsx',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  sourcemap: 'inline',
  plugins: [
    resolve({ extensions: [ '.js', '.json', '.jsx' ] }),
    commonjs({
      namedExports: { 'node_modules/react/react.js': ['Component'] }
    }),
    babel({ exclude: 'node_modules/**' }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') })
  ]
}
