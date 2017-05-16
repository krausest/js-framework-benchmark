'use strict';
var path = require('path')

var cache = {};
var loaders = [
  {
    test: /\.es6\.js$/,
    loader: 'babel-loader'
  },
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader'
  }
];
var extensions = [
  '.js', '.es6.js'
];

module.exports = [{
  cache: cache,
  module: {
    loaders: loaders
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