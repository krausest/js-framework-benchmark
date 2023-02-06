import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import babel from "@rollup/plugin-babel";

export default {
  input: './src/main.jsx',
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      "targets": {
        "esmodules": true
      },
      plugins: [
        ["@ungap/babel-plugin-transform-esx"]
      ]
    }),
    nodeResolve({extensions: [".js", ".jsx"]}),
    terser()
  ],
  output: {
    file: './dist/main.js',
    format: 'iife'
  }
};
