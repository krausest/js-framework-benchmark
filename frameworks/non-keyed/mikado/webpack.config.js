'use strict';
var path = require('path')

module.exports = [{
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: [
				{
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: [],
					}
				}
			]
		}]
	},
	entry: {
		main: './src/main.js',
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: '[name].js'
	},
	resolve: {
		extensions: ['.js']
	}
}];