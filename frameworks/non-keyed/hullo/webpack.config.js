const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  module: {
    rules: []
  },

  output: {
    chunkFilename: "[name].[chunkhash].js",
    filename: "[name].js"
  },

  mode: process.env.NODE_ENV === "production" ? "production" : "development",

  optimization: {
    minimizer: [new TerserPlugin()]
  }
};
