import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import aurelia from '@aurelia/vite-plugin';
import babel from 'vite-plugin-babel';

export default defineConfig({
  server: {
    open: !process.env.CI,
    port: 9000,
  },
  base: '/frameworks/keyed/aurelia2/dist/',
  esbuild: {
    target: 'es2022'
  },
  plugins: [
    aurelia({
      useDev: false,
    }),
    babel(),
    nodePolyfills(),
  ],
});
