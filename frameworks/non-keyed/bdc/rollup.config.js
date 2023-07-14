import resolve from '@rollup/plugin-node-resolve';
import terser  from '@rollup/plugin-terser';

const isProduction = process.env.production;

export default [
  {
    input: 'src/app.js',
    plugins: [
      resolve(),
      isProduction && terser()
    ],
    output: {
      format: 'iife',
      name: 'app',
      file: 'dist/app.min.js',
    }
  },
]


