import { defineConfig } from 'vite';
import { million } from 'million/vite-plugin-million';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [million()],
});
