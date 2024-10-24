import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

const isProduction = process.env.BUILD === 'production'

/** @type {import('rollup').RollupOptions} */
export default {
  input: './src/main.jsx',
  plugins: [
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
      presets: [['pota/babel-preset']],
    }),
    isProduction && terser(),
  ],
  output: [
    {
      format: 'es',
      sourcemap: false,
      file: './dist/main.js',
    },
  ],
}
