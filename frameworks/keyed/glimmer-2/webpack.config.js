const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    app: './index.ts'
  },
  mode: 'production',
  externals: {
    fs: 'fs',
  },
  module: {
    rules: [
      {
        test: /(\.ts|\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['@glimmer/babel-plugin-glimmer-env', { DEBUG: false }],
              '@glimmer/babel-plugin-strict-template-precompile',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              '@babel/plugin-proposal-class-properties',
            ],
            presets: ['@babel/preset-typescript', '@babel/preset-env'],
          },
        },
      },
    ],
  },
	optimization: {
		minimizer: [
			new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
				parallel: true,
				// Enable file caching
				cache: true,
			}),
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify('production') }
		}),
	],
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        mainFields: ['module', 'main'],
      }),
    ],
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    writeToDisk: true,
  },
};
