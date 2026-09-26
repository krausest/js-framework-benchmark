import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import * as core from '@yoyaflow/yoya-ui/core';
// Since 0.7.0 the compiler is a standalone package (a build-time dependency); the older
// `@yoyaflow/yoya-ui/compiler` path is only a forwarding shell.
// 0.7.6 起 Rollup / Vite 用原生入口：不依赖 unplugin（也就不受 unplugin 3 的 Node 20.19+ 约束，
// 上游 .nvmrc 的 Node 20.9 也能直接 build-prod）。
import { yoyaCompileRollup } from '@yoyaflow/yoya-compiler/rollup';

/**
 * Same application source as keyed/yoya-ui-runtime (`src/main.js`, byte-identical); the only
 * difference is the compiler wired in here. `yoyaCompileRollup({ core })` discovers compile units
 * at build time through yoya-ui's own component boundary — top-level factories that return UI views
 * (camelCase shortcuts like `buildRow`, PascalCase components like `Card`) — and replaces them in
 * place with "static fragment + positional writes". The channel is inferred from usage (`buildRow` is
 * passed to `keyed` as the row factory → element channel).
 * The generated output lives in a virtual module: application code imports no generated file and no
 * component manifest is needed.
 */
const plugins = [
  resolve({ browser: true }),
  yoyaCompileRollup({ core })
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
