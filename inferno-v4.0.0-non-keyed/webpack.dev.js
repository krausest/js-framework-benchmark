'use strict';
require("babel-plugin-syntax-jsx")
require("babel-plugin-inferno")
var path = require('path')

var cache = {};
var loaders = [
	{
		test: /\.jsx$/,
		loader: 'babel-loader'
	},
	{
		test: /\.es6\.js$/,
		loader: 'babel-loader'
	}
];
var extensions = [
	  '.dev.mjs', '.mjs', '.js', '.jsx', '.es6.js', '.msx'
];

module.exports = [{
	cache: cache,
	module: {
		loaders: loaders
	},
	entry: {
		main: './src/main',
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: '[name].js',
		sourceMapFilename: "[file].map",
	},
	resolve: {
				modules: [
			__dirname,
			path.resolve(__dirname, "src"),
			"node_modules"
		],
		extensions: extensions,
    /* When doing development workflow we want to make sure webpack picks up development build of inferno */
		alias: {
			inferno: __dirname + "/node_modules/inferno/dist/index.dev.mjs"
		}
	}
}];