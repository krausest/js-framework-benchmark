const fspath = require("path");

module.exports = {
  mode: "production",
  target: "web",
  entry: ["./src/app.tsx"],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".scss", ".css"],
  },
  output: {
    filename: "[name].js",
    path: fspath.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: true,
  },
};
