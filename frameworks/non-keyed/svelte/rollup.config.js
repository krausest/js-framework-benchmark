import svelte from 'rollup-plugin-svelte';
import buble from 'rollup-plugin-buble';
import {uglify} from 'rollup-plugin-uglify';

const plugins = [
    svelte(),
    buble()
];

if (process.env.production) {
    plugins.push(uglify());
}

export default {
    input: 'src/main.es6.js',
    output: {
        file: 'dist/main.js',
        format: 'iife'
    },
    plugins
};
