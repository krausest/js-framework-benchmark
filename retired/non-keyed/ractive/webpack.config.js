'use strict';
var path = require('path')

var loaders = [
  {
    test: /\.ractive\.html$/,
    loader: 'babel-loader'
  },
  {
    test: /\.ractive\.html$/,
    loader: 'ractive-bin-loader'
  }
];
var extensions = [
  '.ractive.html'
];

module.exports = [{
  cache: true,
  module: {
    rules: loaders
  },
  entry: {
    main: './src/main',
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'main.js'
  },
  resolve: {
    extensions: extensions,
		modules: [
			__dirname,
			path.resolve(__dirname, "src"),
			"node_modules"
		],
    alias: {
      "ractive": __dirname+"/node_modules/ractive/ractive.min.js",
    }
  }
}];