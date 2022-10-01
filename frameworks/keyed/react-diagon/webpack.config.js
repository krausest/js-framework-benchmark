const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'production',
	entry: {
		main: path.join(__dirname, 'src', 'main.tsx'),
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify('production') }
		}),
	],
};