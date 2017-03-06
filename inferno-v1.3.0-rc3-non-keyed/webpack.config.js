require("babel-plugin-syntax-jsx");
require("babel-plugin-inferno");

module.exports = [{
	entry: {
		main: './src/main',
	},
	output: {
		path: './dist',
		filename: '[name].js',
		sourceMapFilename: "[file].map",
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader'
			}
		]
	},
	resolve: {
		extensions: [
			'.js', '.jsx'
		],
		alias: {
			"inferno": __dirname + "/node_modules/inferno/dist/inferno.min.js",
			"inferno-component": __dirname + "/node_modules/inferno-component/dist/inferno-component.min.js"
		}
	}
}];