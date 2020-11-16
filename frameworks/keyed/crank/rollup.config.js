import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const development = process.env.CRANK_ENV === "development";
const plugins = [
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    presets: ["babel-preset-crank"],
  }),
  resolve({ extensions: [".js", ".jsx"] }),
];

if (!development) {
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
