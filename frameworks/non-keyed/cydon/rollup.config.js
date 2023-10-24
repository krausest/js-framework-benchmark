import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const plugins = [
  nodeResolve(),
  replace({
    'globalThis.CYDON_NO_EXTRA': 'true',
    preventAssignment: true
  })
];

if (process.env.production) {
  plugins.push(terser({
    ecma: 2020,
    compress: {
      ecma: 2020,
      unsafe: true
    }
  }));
}

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'iife',
    name: 'main'
  },
  plugins
};
