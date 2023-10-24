import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";

const plugins = [
  resolve({
    preferBuiltins: false,
    extensions: [".js", ".jsx"],
  }),
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    presets: [
      [
        "@babel/preset-react",
        {
          throwIfNamespace: false,
          runtime: "automatic",
          importSource: "metron-jsx/web-dom",
        },
      ],
    ],
  }),
];

if (process.env.production) {
  plugins.push(terser());
}

export default {
  input: "src/main.jsx",
  output: {
    file: "dist/main.js",
    format: "iife",
  },
  plugins,
};
