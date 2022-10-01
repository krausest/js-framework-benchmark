import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const plugins = [
  replace({
    "process.env.NODE_ENV": JSON.stringify("production"),
  }),
  babel({
    exclude: "node_modules/**",
    babelHelpers: "bundled",
    plugins: [["jsx-dom-expressions", { moduleName: "vuerx-jsx" }]],
  }),
  resolve({ extensions: [".js", ".jsx"] }),
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
