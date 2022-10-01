'use strict';
var path = require('path');

module.exports = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {targets: 'defaults'}]
                        ]
                    }
                }
            }
        ]
    },
    entry: {
        main: './src/main'
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js',
        sourceMapFilename: "[file].map"
    },
    resolve: {
        modules: [
            __dirname,
            path.resolve(__dirname, "src"),
            "node_modules"
        ],
        extensions: ['.js'],
        alias: {
            'san': 'san/dist/san.spa.modern.js'
        }
    }
};
