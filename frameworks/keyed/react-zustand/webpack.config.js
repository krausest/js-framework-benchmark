const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	// mode: 'development',
	entry: {
		main: path.join(__dirname, 'src', 'main.jsx'),
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: [
				{
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
					}
				}
			]
		}]
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify('production') }
		}),
	],
};
