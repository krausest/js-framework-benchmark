const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

var config = {
    context: __dirname + '/src',
    entry: {
        app: './main.es6.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                ecma: undefined,
                warnings: false,
                parse: {},
                compress: {},
                mangle: true,
                module: false,
                output: null,
                toplevel: true,
                nameCache: null,
                ie8: false,
                keep_classnames: undefined,
                keep_fnames: false,
                safari10: false
            },
            extractComments: true,
        })],
    },
    plugins: [
    ]
};

module.exports = config;
