import { build } from "esbuild";

// Selects the signal implementation injected into Magnet:
//   MAGNET_SIGNALS=tc39 npm run build-prod
// Defaults to the Preact adapter.
const signals = process.env.MAGNET_SIGNALS ?? "preact";

await build({
  entryPoints: ["src/index.js"],
  bundle: true,
  minify: true,
  legalComments: "none",
  define: { MAGNET_SIGNALS: JSON.stringify(signals) },
  outfile: "public/index.js",
});

console.log(`built with MAGNET_SIGNALS=${signals}`);
