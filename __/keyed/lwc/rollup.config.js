import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import lwc from '@lwc/rollup-plugin';

const isProduction = process.env.production;

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'iife',
  },
  plugins: [
    lwc(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
    }),
    isProduction && terser()
  ],
}
