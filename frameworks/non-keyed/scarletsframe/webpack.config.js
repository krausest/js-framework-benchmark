'use strict';
var path = require('path');

module.exports = [{
	cache: {},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
		        exclude: /node_modules/
			}, {
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			}, {
				test: /\.html$/,
				exclude: /node_modules/,
		        loader: 'raw-loader'
			}
		]
	},
	entry: {
		main: './src/main.js',
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: '[name].js'
	},
	resolve: {
		modules: [
			__dirname,
			path.resolve(__dirname, "src"),
			"node_modules"
		],
		extensions: ['.js', '.jsx', '.es6.js', '.msx']
	},
}];