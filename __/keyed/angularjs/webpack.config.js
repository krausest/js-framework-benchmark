'use strict';
var path = require('path')

module.exports = {
    entry: {
        main: './src/main'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                },
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
        ]
    }
};