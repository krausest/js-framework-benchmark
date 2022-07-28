const path = require('path');
const webpack = require('webpack');

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
						"plugins": [
							[
								"@babel/plugin-transform-react-jsx",
								{
									"pragma": "h",
									"pragmaFrag": "Fragment"
								}
							]
						]
					}
				}
			]
		}]
	},
	optimization: {
		minimize: false
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify('production') }
		}),
	],
};
