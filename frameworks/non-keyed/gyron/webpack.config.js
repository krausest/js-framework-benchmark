const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: {
    main: path.join(__dirname, "src", "main.jsx"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                [
                  "@gyron/babel-plugin-jsx",
                  {
                    setup: true,
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
};
