'use strict'

var path = require('path')
module.exports = [{
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  },
  entry: {
    main: './src/main.es6.js',
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.es6.js'],
    modules: [
      __dirname,
      path.resolve(__dirname, "src"),
      "node_modules"
    ]
  }
}]
