'use strict';

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
	'', '.js', '.jsx', '.es6.js'
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
		filename: '[name].js'
	},
	resolve: {
		extensions: extensions,
		root: [
			__dirname,
			__dirname + '/src'
		],
		alias: {
			"react": __dirname+"/node_modules/react/dist/react.min.js",
			"react-dom": __dirname+"/node_modules/react-dom/dist/react-dom.min.js"
		}
	}
}];