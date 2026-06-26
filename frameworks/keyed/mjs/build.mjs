// build.mjs — driver de build pour MJS V2 dans le bench js-framework-benchmark.
//
// 1. Importe le Bundler MJS depuis le repo source (link/file dep dans package.json).
// 2. Compile src/main.mjs → dist/main-<hash>.js + runtime + manifest dist/bundle.js
//
// Note 2026-05-16 : avec le mode `mjs-light` (cf. <mjs-main mjs-light /> dans
// index.html), le composant racine ne crée plus de Shadow DOM. Bootstrap
// global (chargé via <link href="/css/currentStyle.css">) atteint donc les
// rows directement par cascade naturelle — plus besoin du workaround
// @onMount qui injectait un <link> dans le shadow. Le patch post-build
// `mode:"closed"` → `mode:"open"` est aussi retiré : il n'y a plus de
// shadow du tout sur le composant racine, donc le webdriver-ts attaque
// le light DOM directement via document.querySelector.
//
// Usage : node build.mjs [--watch]

import { Bundler } from 'modularjs-compiler'
import { join, resolve } from 'node:path'

const here = resolve(new URL('.', import.meta.url).pathname)
const sourceDir = join(here, 'src')
const outputDir = join(here, 'dist')
const manifestPath = join(outputDir, 'bundle.js')

// URL publique servie par le bench (cf. server/src/static/staticRouter.ts).
// Le serveur Fastify mount frameworksDirectory sous /frameworks, donc nos
// fichiers dist/ sont accessibles sous /frameworks/keyed/mjs/dist/...
const urlPrefix = '/frameworks/keyed/mjs/dist'

process.env.NODE_ENV = 'production'

const bundler = new Bundler({
  sourceDir,
  outputDir,
  manifestPath,
  urlPrefix,
  defaultScriptLang: 'js',
  forceMinify: true,
  // O43 — bench n'utilise ni transitions, ni router, ni ajax, ni ujs.
  // Exclut ces modules → ~10-15KB gzip économisés.
  minimalRuntime: true,
})

console.log('[mjs-bench] compile…')
const stats = await bundler.compile()
console.log(`[mjs-bench] ${stats.written} fichiers écrits en ${stats.durationMs}ms`)
if (stats.errors.length > 0) {
  for (const e of stats.errors) console.error('[mjs-bench] erreur :', e)
  process.exit(1)
}

await bundler.close()
console.log('[mjs-bench] OK')
