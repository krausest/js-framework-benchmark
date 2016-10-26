'use strict';
require("babel-plugin-syntax-jsx")
require("babel-plugin-inferno")

var cache = {};
var loaders = [
	{
		test: /\.jsx$/,
		loader: 'babel-loader'
	},
	{
		test: /\.es6\.js$/,
		loader: 'babel-loader'
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
		main: './src/main',
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
			"inferno": __dirname+"/node_modules/inferno/dist/inferno.min.js",
			"inferno-component": __dirname+"/node_modules/inferno/dist/inferno-component.min.js",
			"inferno-dom": __dirname+"/node_modules/inferno/dist/inferno-dom.min.js",
		}
	}
}];