const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const development = process.env.CRANK_ENV === "development";
module.exports = {
  mode: development ? "development" : "production",
  entry: {
    main: path.join(__dirname, 'src', 'main.jsx'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-crank'],
          }
        }
      ]
    }]
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
};
