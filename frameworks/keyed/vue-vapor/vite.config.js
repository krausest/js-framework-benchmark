import { defineConfig } from 'vite'
import vue from '@vue-vapor/vite-plugin-vue'

export default defineConfig({
  base:'/frameworks/keyed/vue-vapor/dist/',
  plugins: [
    vue({
      vapor: true,
    }),
  ],
})
