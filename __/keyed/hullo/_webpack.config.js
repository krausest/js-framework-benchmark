"use strict";
var path = require("path");
var cache = {};

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  target: "web",
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  entry: {
    main: "./src/Main.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".jsx", ".es6.js"],
    modules: [__dirname, path.resolve(__dirname, "src"), "node_modules"],
    alias: {}
  }
};
