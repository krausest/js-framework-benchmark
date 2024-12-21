import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [
    {
      input: './src/Main.js',  // ['./src/arender.js', './src/apriori.js', './src/sophistry.js', './src/eventivity.js', './src/domitory.js', './src/actribute.js'],
      output: [
        { format: 'es', dir: './dist' },
      ],
      plugins: [nodeResolve(), terser()]
    }
  ]