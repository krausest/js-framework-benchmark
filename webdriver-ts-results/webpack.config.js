'use strict';
require("babel-plugin-syntax-jsx")
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

var path = require('path')
var webpack = require('webpack')
var cache = {};
var loaders = [
	{
		test: /\.jsx$/,
		loader: 'babel-loader'
	},
	{
		test: /\.tsx$/,
		loader: 'ts-loader',
		exclude: /node_modules/
	},
	{
		test: /\.ts$/,
		loader: 'ts-loader',
		exclude: /node_modules/
	},
	{
		test: /\.es6\.js$/,
		loader: 'babel-loader'
	},
	{
		test: /\.css$/,
		loader: 'style-loader!css-loader'
	},
	{
		test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		// Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
		// loader: "url?limit=10000"
		loader: "url-loader"
	},
	{
		test: /\.(svg|ttf|eot|svg)(\?[\s\S]+)?$/,
		loader: 'file-loader'
	}	
];
var extensions = [
	'.ts', '.tsx', '.ts', '.js'
];

module.exports = [{
	cache: cache,
	module: {
		loaders: loaders
	},
	entry: {
		main: './src/App.tsx'
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: '[name].js'
	},
	resolve: {
		extensions: extensions,
		modules: [
			__dirname,
			path.resolve(__dirname, "src"),
			"node_modules"
		]
	},
	plugins: [
		/*new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		}),*/
		new HtmlWebpackPlugin({
			filename: 'result.html',
			template: 'index.html',
			inlineSource: '.(js|css)$' // embed all javascript and css inline
		}),
  	new HtmlWebpackInlineSourcePlugin()	]	
}];