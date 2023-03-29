const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	// mode: 'development',
	entry: {
		main: path.join(__dirname, 'tmp', './src/main'),
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.js']
	},
	module: {
		rules: [{
			test: /\.js?$/,
			exclude: /node_modules/,
			use: [
				{
          loader: 'babel-loader'
				}
			]
		}]
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify('production') }
		}),
	],
};
