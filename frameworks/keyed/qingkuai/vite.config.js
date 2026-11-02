import { defineConfig } from "@qingkuai/cli/vite"

export default defineConfig({
    base: "/frameworks/keyed/qingkuai/dist/",
    build: {
        outDir: "dist",
        minify: "terser",
        emptyOutDir: true,
        modulePreload: {
            polyfill: false
        },
        lib: {
            formats: ["es"],
            entry: "src/main.js",
            fileName: () => "main.js"
        }
    }
})
