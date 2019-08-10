module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "bundle.js"
	},
	module: {
		rules: [
			{ test: /\.js$/, use: "moon-loader" }
		]
	},
	mode: process.env.NODE_ENV
}
