import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { rezact } from "./src/lib/rezact/rezact-plugin";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  // console.log({ command, mode, ssrBuild, example: process.env.example });
  const example = process.env.example || "main";

  const rollupInputs = {
    main: resolve(__dirname + "/src", "index.html"),
    HelloWorldRezact: resolve(
      __dirname,
      "src/examples/HelloWorldRezact/index.html"
    ),
    HelloWorldSvelte: resolve(
      __dirname,
      "src/examples/HelloWorldSvelte/index.html"
    ),
    HelloWorldMultipleRezact: resolve(
      __dirname,
      "src/examples/HelloWorldMultipleRezact/index.html"
    ),
    HelloWorldMultipleSvelte: resolve(
      __dirname,
      "src/examples/HelloWorldMultipleSvelte/index.html"
    ),
    CounterRezact: resolve(__dirname, "src/examples/CounterRezact/index.html"),
    CounterSvelte: resolve(__dirname, "src/examples/CounterSvelte/index.html"),

    CounterMultipleRezact: resolve(
      __dirname,
      "src/examples/CounterMultipleRezact/index.html"
    ),
    CounterMultipleSvelte: resolve(
      __dirname,
      "src/examples/CounterMultipleSvelte/index.html"
    ),

    ListRezact: resolve(__dirname, "src/examples/ListRezact/index.html"),
    ListSvelte: resolve(__dirname, "src/examples/ListSvelte/index.html"),

    BenchmarkRezact: resolve(
      __dirname,
      "src/examples/BenchmarkRezact/index.html"
    ),
    BenchmarkSvelte: resolve(
      __dirname,
      "src/examples/BenchmarkSvelte/index.html"
    ),
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
