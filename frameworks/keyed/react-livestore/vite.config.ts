// @ts-check
import path from 'node:path'

import { livestoreDevtoolsPlugin } from '@livestore/devtools-vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Needed for OPFS Sqlite to work
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements
const credentiallessHeaders = {
  // https://developer.chrome.com/blog/coep-credentialless-origin-trial/
  // 'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Service-Worker-Allowed': '/',
}

const shouldAnalyze = process.env.VITE_ANALYZE !== undefined
const isProdBuild = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config
export default defineConfig({
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 60_001,
    headers: credentiallessHeaders,
    fs: {
      // NOTE currently needed for embedding the `LiveStore` monorepo in another monorepo (e.g. under `/other-monorepo/submodules/livestore`)
      allow: process.env.MONOREPO_ROOT ? [process.env.MONOREPO_ROOT] : [process.env.WORKSPACE_ROOT!],
    },
  },
  preview: {
    headers: credentiallessHeaders,
  },
  build: {
    //   sourcemap: true,
    //   minify: false,
  },
  worker: isProdBuild ? { format: 'es' } : undefined,
  optimizeDeps: {
    // TODO remove once fixed https://github.com/vitejs/vite/issues/8427
    exclude: ['@livestore/wa-sqlite'],
  },
  plugins: [
    react(),
    livestoreDevtoolsPlugin({ schemaPath: './src/schema/index.ts' }),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        maximumFileSizeToCacheInBytes: 4_000_000, // ~4MB
        globPatterns: ['**/*.{js,html,wasm,css,ico,db,lz4,blob}'],
      },
    }),
    // Needed for OPFS Sqlite to work
    {
      name: 'configure-response-headers',
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          Object.entries(credentiallessHeaders).forEach(([key, value]) => res.setHeader(key, value))
          next()
        })
      },
    },
    // @ts-expect-error plugin types seem to be wrong
    shouldAnalyze
      ? visualizer({ filename: path.resolve('./node_modules/.stats/index.html'), gzipSize: true, brotliSize: true })
      : undefined,
  ],
})
