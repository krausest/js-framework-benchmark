import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const plugins = [
  babel({
    exclude: "node_modules/**",
    babelHelpers: "bundled",
    plugins: [["jsx-dom-expressions", { moduleName: "ko-jsx" }]],
  }),
  resolve({ extensions: [".js", ".jsx"] }),
  commonjs({
    include: "node_modules/**",
  }),
];

if (process.env.production) {
  plugins.push(terser({ output: { comments: false } }));
}

export default {
  input: "src/Main.js",
  output: {
    file: "dist/main.js",
    format: "iife",
  },
  plugins,
};
