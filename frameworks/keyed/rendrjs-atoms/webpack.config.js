const path = require('path');

module.exports = (env = {}) => ({
  mode: 'production',
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
  },
});
