import resolve from '@rollup/plugin-node-resolve';
import derver from 'derver/rollup-plugin';
import { terser } from "rollup-plugin-terser";
import malina from 'malinajs/malina-rollup';
import staticText from 'malinajs/plugins/static-text';

const DEV = !!process.env.ROLLUP_WATCH;

export default {
    input: 'src/main.js',
    output: {
        file: 'public/bundle.js',
        format: 'iife',
    },
    plugins: [
        malina({
            passClass: false,
            compact: 'full',
            useGroupReferencing: false,
            plugins: [staticText()]
        }),
        resolve(),
        DEV && derver(),
        !DEV && terser()
    ],
    watch: {
        clearScreen: false
    }
}
