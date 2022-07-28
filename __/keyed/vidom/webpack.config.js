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
						presets: ['@babel/preset-env', '@babel/preset-react'],
						plugins: ['vidom-jsx'],
					}
				}
			]
		}]	},
	entry: {
		main: './src/main',
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: '[name].js',
		sourceMapFilename: "[file].map",
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: [
			__dirname,
			path.resolve(__dirname, "src"),
			"node_modules"
		],
		alias: {
			"vidom": __dirname+"/node_modules/vidom/dist/vidom.min.js",
		}
	}
}];
