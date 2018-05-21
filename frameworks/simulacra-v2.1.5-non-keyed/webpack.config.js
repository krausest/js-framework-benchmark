'use strict';
var path = require('path')

var cache = {};
var loaders = [
	{
		test: /\.es6\.js$/,
		loader: 'babel-loader',
		exclude: [/node_modules/, '.'],
		query: {
			presets: ['es2015', 'stage-0']
		}
	}
];
var extensions = [
	'.js', '.es6.js'
];

module.exports = [{
	cache: cache,
	module: {
		loaders: loaders
	},
	entry: './src/main',
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: 'main.js',
		sourceMapFilename: "main.map",
	},
	resolve: {
		extensions: extensions,
		modules: [
			__dirname,
			path.resolve(__dirname, "src"),
			"node_modules"
		],
		alias: {
		}
	}
}];