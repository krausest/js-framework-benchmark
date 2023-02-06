import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import babel from "@rollup/plugin-babel";

export default {
  input: './src/main.js',
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      "targets": {
        "esmodules": true
      }
    }),
    nodeResolve({extensions: [".js", ".jsx"]}),
    terser()
  ],
  output: {
    file: './dist/main.js',
    format: 'iife'
  }
};
