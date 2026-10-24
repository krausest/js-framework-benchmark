const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  /** @type {import("webpack").Configuration} */
  const config = {
    mode: isProduction ? "production" : "development",
    entry: {
      main: path.join(__dirname, "src", "main.imba"),
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].js",
    },
    resolve: {
      extensions: [".imba"],
    },
    module: {
      rules: [
        {
          test: /\.imba$/,
          loader: "imba/loader.js",
        },
      ],
    },

    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              ecma: 5,
              comparisons: true,
            },
            mangle: {
              safari10: true,
            },
          },
        }),
      ],
    },
  };
  return config;
};
