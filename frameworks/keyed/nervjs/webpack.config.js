"use strict";
require("babel-plugin-syntax-jsx");
var path = require("path");
var cache = {};
var loaders = [
  {
    test: /\.jsx$/,
    loader: "babel-loader"
  },
  {
    test: /\.es6\.js$/,
    loader: "babel-loader"
  },
  {
    test: /\.css$/,
    loader: "style-loader!css-loader"
  }
];
var extensions = [".js", ".jsx", ".es6.js", ".msx"];

module.exports = [
  {
    cache: cache,
    module: {
      rules: loaders
    },
    entry: {
      main: "./src/Main.jsx"
    },
    output: {
	  path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      sourceMapFilename: "[file].map"
    },
    resolve: {
      extensions: extensions,
      modules: [
        __dirname,
        path.resolve(__dirname, "src"),
        "node_modules"
      ],
      alias: {
        nervjs: path.resolve(
          __dirname,
          "node_modules",
          "nervjs",
          "dist",
          "index.prod.js"
        )
      }
    }
  }
];
