'use strict';

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
			"vue": __dirname+"/node_modules/vue/dist/vue.min.js",
		}
	}
}];