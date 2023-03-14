"use strict";
var path = require("path");
var webpack = require("webpack");
var TerserPlugin = require("terser-webpack-plugin");
var loaders = [
  {
    test: /\.jsx$/,
    loader: "babel-loader",
  },
  {
    test: /\.es6\.js$/,
    loader: "babel-loader",
  }
];
var extensions = [".js", ".jsx", ".es6.js"];

module.exports = [
  {
    cache: true,
    module: {
      rules: loaders,
    },
    entry: {
      main: "./src/Main.jsx",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
    },
    resolve: {
      extensions: extensions,
      modules: [__dirname, path.resolve(__dirname, "src"), "node_modules"],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": '"production"',
      }),
    ],
  },
];
