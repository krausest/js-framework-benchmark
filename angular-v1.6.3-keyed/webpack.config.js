'use strict';
var path = require('path')

module.exports = {
  entry: {
    main: './src/main'
  },
  output: {
    path: './dist',
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};