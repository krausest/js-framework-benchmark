import terser from '@rollup/plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals-v3';

export default {
  input: `src/index.js`,
  output: { file: `dist/index.js`, format: 'iife' },
  plugins: [
    minifyHTML(),
    terser()
  ]
};
