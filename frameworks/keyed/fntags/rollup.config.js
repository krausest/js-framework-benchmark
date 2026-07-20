import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { rimrafSync } from 'rimraf'

const rmGlob = `dist/**`

rimrafSync(rmGlob, { glob: true })

const isDev = process.env.DEV === "true"

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: `src/Main.js`,
  output: [
    {
      file: `dist/Main.js`,
      format: 'es',
      sourcemap: false,
      plugins: isDev ? [] : [terser()]
    }
  ],
  plugins: [nodeResolve({
    dedupe: ['@srfnstack/fntags']
  })]
}
