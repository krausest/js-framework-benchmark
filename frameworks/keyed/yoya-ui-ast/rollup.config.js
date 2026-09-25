import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import * as core from '@yoyaflow/yoya-ui/core';
// Since 0.7.0 the compiler is a standalone package (a build-time dependency); the older
// `@yoyaflow/yoya-ui/compiler` path is only a forwarding shell.
import { yoyaCompile } from '@yoyaflow/yoya-compiler';

/**
 * Same application source as keyed/yoya-ui-runtime (`src/main.js`, byte-identical); the only
 * difference is the compiler wired in here. `yoyaCompile.rollup({ core })` discovers compile units
 * at build time through yoya-ui's own component boundary — top-level factories that return UI views
 * (camelCase shortcuts like `buildRow`, PascalCase components like `Card`) — and replaces them in
 * place with "static fragment + positional writes". The channel is inferred from usage (`buildRow` is
 * passed to `keyed` as the row factory → element channel).
 * The generated output lives in a virtual module: application code imports no generated file and no
 * component manifest is needed.
 */
const plugins = [
  resolve({ browser: true }),
  yoyaCompile.rollup({ core })
];

if (process.env.production) {
  plugins.push(terser());
}

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'iife',
    name: 'main'
  },
  plugins
};
