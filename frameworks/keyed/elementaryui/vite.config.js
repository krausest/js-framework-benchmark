import { defineConfig } from "vite";
import swiftWasm from "@elementary-swift/vite-plugin-swift-wasm";

export default defineConfig({
  base: "./",
  build: {
    outDir: "bundled-dist",
    emptyOutDir: true,
  },
  plugins: [
    swiftWasm({
      useEmbeddedSDK: true,
      linkEmbeddedUnicodeDataTables: false,
    }),
  ],
});
