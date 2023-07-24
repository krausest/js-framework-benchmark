import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const isProd = process.env.production;

export default {
  input: "app.js",
  output: {
    file: "dist/app.min.js",
    format: "es",
    name: "app",
  },
  plugins: [resolve(), isProd && terser()],
};
