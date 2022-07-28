import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';


export default [
  {
    input: 'src/app.js',
    plugins: [
      resolve(),
      terser(),
    ],
    output: {
      format: 'iife',
      name: 'app',
      file: 'dist/app.min.js',
      sourcemap: true,
      sourcemapFile: 'dist/app.min.js.map'
    }
  },
]


