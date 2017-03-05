'use strict';

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
  '', '.js', '.es6.js'
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
    path: './dist',
    filename: 'main.js'
  },
  resolve: {
    extensions: extensions,
    root: [
      __dirname,
      __dirname + '/src'
    ],
    alias: {
      "ractive": __dirname+"/node_modules/ractive/ractive.min.js",
    }
  }
}];