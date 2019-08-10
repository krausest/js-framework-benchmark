const path = require("path");

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist")
	},
	module: {
		rules: [
			{ test: /\.js$/, use: "moon-loader" }
		]
	},
	mode: process.env.NODE_ENV
}
