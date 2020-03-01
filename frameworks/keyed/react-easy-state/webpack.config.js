'use strict';
var path = require('path')
var webpack = require('webpack')

var cache = {};

var rules = [
	{
		test: /\.jsx$/,
		loader: 'babel-loader'
	},
	{
		test: /\.js$/,
		loader: 'babel-loader'
	},
	{
		test: /\.css$/,
		loader: 'style-loader!css-loader'
	}
];
var extensions = [
	'.js', '.jsx', '.es6.js'
];

module.exports = [{
    entry: {
        main: './src/index.jsx',
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            __dirname,
            path.resolve(__dirname, "src"),
            "node_modules"
        ],
        alias: {
            'react-easy-state': 'react-easy-state/dist/es.es6',
            '@nx-js/observer-util': '@nx-js/observer-util/dist/es.es6'
        }
    },
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: [
				{
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
						plugins: ['@babel/plugin-proposal-class-properties'],
					}
				}
			]
		}]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		})
	]
}];