'use strict'
var path = require('path')
var cache = {}

var loaders = [
  {
    test: /\.es6\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/
  },
  {
    test: /\.html$/, loader: 'tag-loader',
    query: {
      type: 'es6'
    }
  },
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader'
  }
]

var extensions = [
  '.js', '.es6.js', '.html'
]

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
    filename: '[name].js',
    sourceMapFilename: "[file].map",
  },
  resolve: {
    extensions: extensions,
		modules: [
			__dirname,
			path.resolve(__dirname, "src"),
			"node_modules"
		],
    alias: {
      "riot": __dirname+"/node_modules/riot/riot.min.js",
    }
  }
}]