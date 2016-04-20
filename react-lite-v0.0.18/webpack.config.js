'use strict';
require("babel-plugin-syntax-jsx")

var cache = {};
var loaders = [
	{
		test: /\.jsx$/,
		loader: 'babel-loader?presets[]=es2015,presets[]=react'
	},
	{
		test: /\.es6\.js$/,
		loader: 'babel-loader?presets[]=es2015'
	},
	{
		test: /\.css$/,
		loader: 'style-loader!css-loader'
	}
];
var extensions = [
	'', '.js', '.jsx', '.es6.js', '.msx'
];

module.exports = [{
	cache: cache,
	module: {
		loaders: loaders
	},
	entry: {
		main: './src/main.es6.js',
	},
	output: {
		path: './dist',
		filename: '[name].js',
		sourceMapFilename: "[file].map",
	},
	resolve: {
		extensions: extensions,
		root: [
			__dirname,
			__dirname + '/src'
		],
		alias: {
				'react': 'react-lite',
				'react-dom': 'react-lite'
			}
	}
}];