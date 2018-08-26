'use strict';
var path = require('path')

module.exports = [{
  module: {
    rules: [
      {
        test: /template\.html$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: '@vanilla-ftw/vanilla-dom-loader'
        }
      }
    ]
  },
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js'
  }
}];
