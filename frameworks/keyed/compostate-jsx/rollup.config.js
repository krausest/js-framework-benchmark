import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import replace from 'rollup-plugin-replace'

const plugins = [
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    plugins: [
      ["babel-plugin-jsx-dom-expressions", { "moduleName": "compostate-jsx" }]
    ]
  }),
  resolve({ extensions: [".js", ".jsx"] }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
];

if (process.env.production) {
  plugins.push(terser({ output: { comments: false } }));
}

export default {
  input: "src/main.jsx",
  output: {
    file: "dist/main.js",
    format: "iife",
  },
  plugins,
};
