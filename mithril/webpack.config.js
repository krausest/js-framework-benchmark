'use strict';
// require("babel-plugin-mjsx")

var cache = {};
var loaders = [
	{
		test: /\.jsx$/,
		loader: 'jsx-loader!babel-loader'
	},
/*	{
		test: /\.msx$/,
		loader: 'babel-plugin-mjsx!babel-loader'
	},*/
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
		main: './src/entry/main',
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
			"mithril": __dirname+"/node_modules/mithril/mithril.min.js",
		}
	}
}];

/*
 "react": __dirname+"/node_modules/react/dist/react.min.js",
 "fluxthis": __dirname+"/node_modules/fluxthis/build/FluxThis.min.js"
 */