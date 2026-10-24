var path = require('path')


module.exports = [{
  cache: true,
  module: {
    rules: [
      {
        test: /\.riot$/,
        exclude: /node_modules/,
        use: [{
          loader: '@riotjs/webpack-loader'
        }]
      }
    ]
  },
  entry: {
    main: './src/main'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  resolve: {
    modules: [
      __dirname,
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  }
}]