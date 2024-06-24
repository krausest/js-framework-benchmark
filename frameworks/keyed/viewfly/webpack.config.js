const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    index: path.resolve(__dirname, './src/index.tsx')
  },
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devServer: {
    host: '0.0.0.0',
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 3322,
    hot: true,
    open: true
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [{
        loader: 'ts-loader',
      }]
    }, {
      test: /\.(jpe?g|png|svg|gif)$/,
      type: 'asset'
    }]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './index.html'
    // })
  ]
}
