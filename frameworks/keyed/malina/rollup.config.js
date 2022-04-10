import resolve from '@rollup/plugin-node-resolve';
import derver from 'derver/rollup-plugin';
import { terser } from "rollup-plugin-terser";
import malina from 'malinajs/malina-rollup'

const DEV = !!process.env.ROLLUP_WATCH;

export default {
    input: 'src/main.js',
    output: {
        file: 'public/bundle.js',
        format: 'iife',
    },
    plugins: [
        malina({passClass: false}),
        resolve(),
        DEV && derver(),
        !DEV && terser()
    ],
    watch: {
        clearScreen: false
    }
}
