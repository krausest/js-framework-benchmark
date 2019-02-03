'use strict';

const path = require('path');

var cache = {};

module.exports = {
    cache: cache,
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js',
        publicPath: 'dist/'
    },
    plugins: [ ],
    mode: 'production'
};
