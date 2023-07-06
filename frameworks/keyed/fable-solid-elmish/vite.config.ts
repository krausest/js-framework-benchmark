import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
    clearScreen: false,
    plugins: [ solidPlugin() ]
})