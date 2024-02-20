import { defineConfig }       from "vite"
import scalaJSPlugin          from "@scala-js/vite-plugin-scalajs"
import injectHtmlVarsPlugin   from "./vite-plugins/inject-html-vars.js"
import rollupPluginSourcemaps from "rollup-plugin-sourcemaps"
import globResolverPlugin     from "@raquo/vite-plugin-glob-resolver"
import importSideEffectPlugin from "@raquo/vite-plugin-import-side-effect"

export default defineConfig(
  ({
    command,
    mode,
    ssrBuild,
  }) => {
    return {
      base:      "/frameworks/keyed/laminar/bundled-dist/",
      publicDir: "public",
      plugins:   [
        scalaJSPlugin({
          cwd:       ".",        // Path to build.sbt
          projectID: "frontend", // Scala.js project name in build.sbt
        }),
        globResolverPlugin({
          // See: https://github.com/raquo/vite-plugin-glob-resolver
          cwd:    __dirname,
          ignore: [
            'node_modules/**',
            'target/**',
          ],
        }),
        importSideEffectPlugin({
          // See: https://github.com/raquo/vite-plugin-import-side-effect
          defNames: ['importStyle'],
          rewriteModuleIds: ['**/*.less', '**/*.css'],
        }),
        injectHtmlVarsPlugin({
          SCRIPT_URL: './index.js',
        }),
      ],
      build: {
        outDir:        "bundled-dist",
        assetsDir:     "assets",  // path relative to outDir
        cssCodeSplit:  false,     // false = Load all CSS upfront
        rollupOptions: {
          plugins: [rollupPluginSourcemaps()],
        },
        minify:        "terser",
        sourcemap:     true,
      },
      server: {
        port:       3000,
        strictPort: true,
        logLevel:   "debug",
      }
    }
  }
)