import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const plugins = [
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    presets: [["dlight", { files: "**/*.js" }]]
  }),
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    plugins: [
      ["@babel/plugin-proposal-decorators", { version: "legacy" }],
      ["@babel/plugin-proposal-class-properties", { loose: true }]
    ]
  }),
  resolve({ extensions: [".js"] }),
]

if (process.env.production) {
  plugins.push(terser());
}

export default {
  input: "src/main.js",
  output: {
    file: "dist/main.js"
  }, 
  plugins
}
