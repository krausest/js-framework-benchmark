import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { rezact } from "@rezact/rezact/vite-plugin";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  // console.log({ command, mode, ssrBuild, example: process.env.example });
  const example = process.env.example || "main";

  const rollupInputs = {
    main: resolve(__dirname + "/src", "index.html"),
   
  };

  const rollupInput = { input: rollupInputs[example] };
  const config: any = {
    test: {
      global: true,
      environment: "happy-dom",
    },

    resolve: {
      alias: {
        src: "/src",
        rezact: "@rezact/rezact",
      },
    },
    build: {
      emptyOutDir: true,
      target: "esnext",
      modulePreload: {
        polyfill: false,
      },
      minify: true,
      rollupOptions: {
        input: "src/main.js",
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        }
      },
    },
    plugins: [rezact()],
  };
  if (mode === "production") {
    config.esbuild = {
      drop: ["console", "debugger"],
    };
  }
  return config;
});
