module.exports = {
  entry: "./app.tsx",
  output: {
    filename: "app.min.js"
  },
  resolve: {
    extensions: [".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-typescript", "@babel/preset-env"],
          plugins: ["@fidanjs/fidan-jsx"]
        }
      }
    ]
  }
};
