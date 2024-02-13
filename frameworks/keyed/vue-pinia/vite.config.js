import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base:'/frameworks/keyed/vue-pinia/dist/',
  plugins: [vue()],
})
