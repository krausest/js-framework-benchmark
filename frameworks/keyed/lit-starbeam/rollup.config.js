import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import typescript from 'rollup-plugin-ts';

export default {
 // https://github.com/rollup/rollup/issues/1828
  watch: {
    chokidar: {
      usePolling: true,
    },
  },
  input: `src/main.ts`,
  output: { file: `dist/main.js`, format: 'iife', name: 'app' },
  plugins: [
    nodeResolve(),
    commonjs(),
    minifyHTML(),
    typescript({
      transpiler: 'babel',
      browserslist: ['last 1 chrome versions'],
      transpileOnly: false,
    }),
    terser({ warnings: true, mangle: { module: true } }),
  ],
};
