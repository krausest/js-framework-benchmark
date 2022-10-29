import {nodeResolve} from '@rollup/plugin-node-resolve';
// import {terser} from 'rollup-plugin-terser';
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
        ["@ungap/babel-plugin-transform-hinted-jsx"]
      ]
    }),
    nodeResolve({extensions: [".js", ".jsx"]}),
    // yay, terser breaks my code!
    // terser({mangle: false, output: {comments: false}})
  ],
  output: {
    file: './dist/main.js',
    format: 'iife'
  }
};
