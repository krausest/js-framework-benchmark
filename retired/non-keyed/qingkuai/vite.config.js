import { defineConfig } from "vite"
import qingkuai from "vite-plugin-qingkuai"

export default defineConfig({
    build: {
        modulePreload: {
            polyfill: false
        },
        lib: {
            name: "main",
            formats: ["es"],
            entry: "src/main.js",
            fileName: () => "main.js"
        },
        minify: "terser"
    },
    plugins: [qingkuai()],
    base: "/frameworks/keyed/qingkuai/dist/"
})
