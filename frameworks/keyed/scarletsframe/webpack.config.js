'use strict';
var path = require('path')
var cache = {};
var loaders = [
	{
		test: /\.js$/,
		loader: 'babel-loader',
        exclude: /node_modules/
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
		extensions: extensions
	},
}];