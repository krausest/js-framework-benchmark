'use strict';
require("babel-plugin-syntax-jsx")
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
	cache: cache,
	module: {
		rules
	},
	entry: {
		main: './src/index.jsx',
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: extensions,
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
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		})
	]
}];