import commonjsPlugin from "rollup-plugin-commonjs";
import nodeResolvePlugin from "rollup-plugin-node-resolve";
import babelPlugin from "@rollup/plugin-babel";
import path from "path";
import replace from "rollup-plugin-replace";
import terser from "@rollup/plugin-terser";
import alias from "@rollup/plugin-alias";
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const isProduction = !!process.env.production;

const extensions = ['.js', '.jsx'];

// see below for details on the options
const plugins = [
  nodeResolvePlugin({
    preferBuiltins: false,
    extensions: extensions
  }),
  replace({
    'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development'),
    sourcemap: false
  }),
  babelPlugin({
    exclude: 'node_modules/**',
    sourceMaps: false
  }),
  commonjsPlugin({
    sourceMap: false,
    extensions: extensions
  }),
];

if (isProduction) {
  plugins.push(terser({
    compress: {
      inline: 0,
      reduce_vars: false,
      passes: 5,
      booleans: false,
      comparisons: false,
      keep_infinity: true,
    },
    toplevel: true,
    mangle: true,
    module: true,
  }));
}

// When in development, we want to use dev build of inferno.
// DEV build has helper functionalities build for development only.
// When we are shipping to production we don't want those checks to be included
plugins.unshift(
    alias({
      resolve: extensions,
      'inferno': __dirname + '/node_modules/inferno/dist/' + (isProduction ? 'index.esm.js' : 'index.dev.esm.js')
    })
);

export default {
  input: path.join(__dirname, 'src/main.es6.js'),
  output: {
    name: 'inferno',
    format: 'iife',
    file: path.join(__dirname, 'dist', 'main.js'),
    sourcemap: false
  },
  plugins: plugins
}
