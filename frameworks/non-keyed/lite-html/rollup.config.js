import { terser } from 'rollup-plugin-terser';

export default {
  input: `src/index.js`,
  output: { file: `dist/index.js`, format: 'es' },
  plugins: [terser({ warnings: true, mangle: { module: true } })]
};
