const path = require('path');
const webpack = require('webpack');

let mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

module.exports = {
  mode,
	entry: {
		main: path.join(__dirname, 'src', 'main.jsx'),
	},
	output: {
		path: path.join(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
		}]
	},
	plugins: [],
};
