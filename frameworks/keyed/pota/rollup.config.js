import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const outputOptions = {
  format: "es",
  sourcemap: false,
};

const plugins = [
  resolve({}),
  babel({
    babelHelpers: "bundled",
    presets: [["pota/babel-preset"]],
  }),
  terser(),
];

export default [
  {
    input: "./src/main.jsx",
    plugins,
    output: [
      {
        ...outputOptions,
        file: "./dist/main.js",
      },
    ],
  },
];
