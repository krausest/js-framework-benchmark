'use strict';
const path = require('path');

const loaders = [
  {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    options: {
      presets: ['@babel/preset-env'],
      plugins: [
        [
          '@babel/plugin-transform-react-jsx',
          {
            pragma: 'html'
          }
        ],
        '@babel/plugin-proposal-class-properties'
      ]
    }
  },
  {
    test: /\.es6\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    options: {
      presets: ['@babel/preset-env']
    }
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  }
];

const extensions = [
  '.js', '.jsx', '.es6.js'
];

module.exports = [{
  module: {
    rules: loaders
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
    modules: [
      __dirname,
      path.resolve(__dirname, "src"),
      "node_modules"
    ],
    extensions,
    alias: {
    }
  }
}];