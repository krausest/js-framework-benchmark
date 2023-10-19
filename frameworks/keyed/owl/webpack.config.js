const path = require('path')

module.exports = (env = {}) => ({
	mode: 'production',
	entry: path.resolve(__dirname, './src/main.js'),
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/'
	},
	resolve: {
		alias: {
			extensions: [".js", ".jsx"],
		}
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
			},
		]
	},
	plugins: [
	],
})
