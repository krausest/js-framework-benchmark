import commonjsPlugin from 'rollup-plugin-commonjs';
import browserifyPlugin from 'rollup-plugin-browserify-transform';
import nodeResolvePlugin from 'rollup-plugin-node-resolve';
import markoify from 'markoify';
import envify from 'envify';
import minpropsify from 'minprops/browserify';
import path from 'path';
import {uglify} from 'rollup-plugin-uglify';
import buble from 'rollup-plugin-buble';

var browserifyPlugins = [
    browserifyPlugin(markoify)
];

if (process.env.NODE_ENV === 'production') {
    browserifyPlugins = browserifyPlugins.concat([
        browserifyPlugin(envify),
        browserifyPlugin(minpropsify)
    ]);
}

var plugins = browserifyPlugins.concat([
    nodeResolvePlugin({
        jsnext: true,  // Default: false
        main: true,  // Default: true
        browser: true,  // Default: false
        preferBuiltins: false,
        extensions: [ '.js', '.marko' ]
    }),
    commonjsPlugin({
        include: [ 'node_modules/**', '**/*.marko', '**/*.js'],
        extensions: [ '.js', '.marko' ]
    })
]);

if (process.env.NODE_ENV === 'production') {
    plugins.push( buble() );
    plugins.push( uglify() );
}

export default {
    input: path.join(__dirname, 'src/client.js'),
    name: 'app',
    plugins: plugins,
    output: {
        format: 'iife',
        file: path.join(__dirname, 'dist/bundle.js')
    }
};