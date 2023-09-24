import HtmlWebpackPlugin from "html-webpack-plugin";
import InlineChunkHtmlPlugin from "inline-chunk-html-plugin";
import path from "path";
import { rules } from "./tools/webpack/webpack.rules.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("webpack").Configuration} */
export default {
  entry: "./src/index.tsx",
  output: {
    clean: true,
    publicPath: "/",
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules,
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
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "table.html",
      inject: true,
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/main|vendor|BoxPlotTable/]),
  ],
};
