var webpack = require('webpack');
var helpers = require('./helpers');

module.exports = {
  entry: {
    'polyfills': './lib/polyfills.js',
    'app': './lib/main.aot.js'
  },

  resolve: {
    extensions: ['', '.js', '.ts']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts'
      }
    ]
  },

  plugins: [

  ]
};
