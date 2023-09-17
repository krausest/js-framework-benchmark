import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { fileURLToPath } from "url";
import { rules } from "./tools/webpack/webpack.rules.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("webpack").Configuration} */
export default {
  module: {
    rules,
  },
  entry: {
    main: "./src/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
        plotly: {
          test: /[\\/]node_modules[\\/]plotly.*[\\/]/,
          name: "plotly",
          chunks: "all",
          priority: 20,
        },
      },
    },
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
