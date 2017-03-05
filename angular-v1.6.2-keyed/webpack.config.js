module.exports = {
  entry: {
    main: './src/main'
  },
  output: {
    path: './dist',
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.es6\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};