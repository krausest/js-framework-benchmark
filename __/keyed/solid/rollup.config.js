import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const plugins = [
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    presets: ["solid"],
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
