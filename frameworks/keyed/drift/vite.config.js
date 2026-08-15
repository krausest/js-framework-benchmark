import { defineConfig } from 'vite';
import driftPlugin from 'driftjs-vite-plugin';

export default defineConfig({
  base: '/frameworks/keyed/drift/dist/',
  plugins: [driftPlugin()],
});
