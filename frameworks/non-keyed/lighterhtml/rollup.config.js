import { terser } from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: `src/index.js`,
    context: 'null', 
    moduleContext: 'null',
    output: {
        file: `dist/index.js`,
        format: 'iife'
    },
    plugins: [
        nodeResolve({
            module: true,
            jsnext: true,
            main: true
        }),

        commonjs({
            include: 'node_modules/**',
            extensions: ['.js', '.coffee'],
            ignoreGlobal: false,
            sourceMap: false
        }),
        minifyHTML(),
        terser({
            warnings: true,
            mangle: {
                module: true
            }
        })
    ]
};