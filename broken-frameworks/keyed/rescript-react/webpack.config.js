const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	// mode: 'development',
	entry: {
		main: path.join(__dirname, 'src', 'Index.bs.js'),
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
						presets: ['@babel/preset-env', '@babel/preset-react'],
						plugins: ['@babel/plugin-proposal-class-properties'],
					}
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
