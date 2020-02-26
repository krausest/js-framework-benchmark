import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';

export default {
  input: 'src/Main.bs.js',
  output: {
    name: 'jfb',
    file: 'dist/main.js',
    format: 'iife',
  },
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: './preact.js' },
        { find: 'react-dom', replacement: './preact.js' },
      ],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve(),
    commonjs(),
    terser({
      compress: {
        passes: 10,
      },
    }),
  ],
};
