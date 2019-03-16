import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { endorphin } from '@endorphinjs/rollup-plugin-endorphin';
import {uglify} from 'rollup-plugin-uglify';

export default {
    input: './src/app.js',
    plugins: [
        resolve(),
        commonjs(),
        endorphin(),
        buble({
            transforms: { forOf: false },
            objectAssign: 'Object.assign'
        }),
        process.env.production ? uglify() : null
    ],
    output: [{
        format: 'iife',
        file: './dist/main.js',
        sourcemap: true
    }],
    watch: {
        // Используем chokidar, так как стандартный fs.watch может дважды посылать
        // нотификации на одно изменение
        chokidar: true
    }
};
