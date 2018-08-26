var path = require('path')

module.exports = {
  entry: {
    'main': './src/main.tsx',
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  }
}