'use strict';
require("babel-plugin-syntax-jsx")
var path = require('path')
const MinifyPlugin = require("babel-minify-webpack-plugin");
var webpack = require('webpack')

var cache = {};
var loaders = [
    {
        test: /\.jsx$/,
        loader: 'babel-loader'
    },
    {
        test: /\.es6\.js$/,
        loader: 'babel-loader'
    },
    {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
    }
];
var extensions = [
    '.js', '.jsx', '.es6.js', '.msx'
];

module.exports = [{
    cache: cache,
    module: {
        rules: loaders
    },
    entry: {
        main: './src/Main.jsx',
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js',
        sourceMapFilename: "[file].map",
		library: "mimbl-benchmark",
		libraryTarget: 'umd',
		globalObject: 'this'
    },
    resolve: {
        extensions: extensions,
        modules: [
            __dirname,
            path.resolve(__dirname, "src"),
            "node_modules"
        ],
        alias: {
            'mimbl': 'node_modules/mimbl/dist/mimbl.js',
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new MinifyPlugin()
    ],

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals:
    {
        mimbl: { root: 'mimbl', commonjs2: 'mimbl', commonjs: 'mimbl', amd: 'mimbl' },
    }
}];