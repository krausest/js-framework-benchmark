'use strict';

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
						pragma: 'hJSX'
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
	'', '.js', '.jsx', '.es6.js'
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
			"rx": __dirname+"/node_modules/rx/dist/rx.all.min.js",
			"@cycle/core": __dirname+"/node_modules/@cycle/core/dist/cycle.min.js",
			"@cycle/dom": __dirname+"/node_modules/@cycle/dom/dist/cycle-dom.min.js"
		}
	}
}];