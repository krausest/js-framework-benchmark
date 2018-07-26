'use strict';
var path = require('path')

var cache = {};
var loaders = [
	{
		test: /\.jsx?$/,
		loader: 'babel-loader',
		exclude: /node_modules/,
		query: {
			presets: ['es2015', 'stage-0'],
			plugins: [
				[
					'transform-react-jsx',
					{
						pragma: 'html'
					}
				]
			]
		}
	},
	{
		test: /\.es6\.js$/,
		loader: 'babel-loader',
		exclude: /node_modules/,
		query: {
			presets: ['es2015', 'stage-0']
		}
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
		alias: {
		}
	}
}];