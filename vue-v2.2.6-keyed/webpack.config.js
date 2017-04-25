'use strict';
var path = require('path')
var webpack = require('webpack')
var cache = {};
var loaders = [
	{
		test: /\.jsx$/,
		loader: 'jsx-loader!babel-loader',
		exclude: /node_modules/,
		query: {
          presets: ['es2015']
        }
	},
	{
		test: /\.js$/,
		loader: 'babel-loader',
		exclude: /node_modules/
	},
	{
		test: /\.css$/,
		loader: 'style-loader!css-loader'
	},
	{
		test: /\.vue$/,
		loader: 'vue-loader',
		query: {
			preserveWhitespace: false
		}
	}
];
var extensions = [
	'.js', '.jsx', '.es6.js', '.msx'
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
		extensions: extensions
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		})
	]
}];
