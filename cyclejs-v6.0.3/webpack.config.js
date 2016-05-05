'use strict';

var cache = {};
var loaders = [
	{
		test: /\.es6|\.js$/,
		loader: 'babel-loader'
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
		main: './src/SingleMain.es6',
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
			"rx": __dirname+"/node_modules/rx/dist/rx.all.min.js",
			"@cycle/core": __dirname+"/node_modules/@cycle/core/dist/cycle.min.js",
			"@cycle/dom": __dirname+"/node_modules/@cycle/dom/dist/cycle-dom.min.js"
		}
	}
}];