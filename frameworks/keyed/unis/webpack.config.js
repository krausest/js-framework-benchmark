const path = require('path')

module.exports = (env = {}) => ({
	mode: 'production',
	entry: path.resolve(__dirname, './src/main.jsx'),
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/'
	},
	module: {
		rules: [
			{
				test: /\.m?jsx?$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@unis/babel-preset']
					}
				}
			}
		]
	}
})
