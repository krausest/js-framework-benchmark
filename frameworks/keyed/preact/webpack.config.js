'use strict';
var path = require('path')
var webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin');

var extensions = [
    '.js', '.jsx', '.es6.js', '.msx'
];

module.exports = [{
    cache: true,
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.es6\.js$/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    entry: {
        main: './src/Main.jsx',
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js',
        sourceMapFilename: "[file].map",
    },
    resolve: {
        extensions: extensions,
        modules: [
            __dirname,
            path.resolve(__dirname, "src"),
            "node_modules"
        ],
        alias: {
            'preact': 'node_modules/preact/dist/preact.js',
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
	optimization: {
        minimize: true,
		minimizer: [
			new TerserPlugin({}),
		]
	},    
}];