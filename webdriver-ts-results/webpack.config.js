var HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var InlineChunkHtmlPlugin = require('inline-chunk-html-plugin');

var path = require('path')
var cache = {};
var loaders = [
	{
		test: /\.tsx$|\.ts$/,
		loader: 'ts-loader',
		exclude: /node_modules/,
    options: {
        configFile: "tsconfig.prod.json"
    }
	},
	{
		test: /\.css$/,
		loader: 'style-loader!css-loader'
	}
];
var extensions = [
	'.ts', '.tsx', '.ts', '.js'
];

module.exports = [{
	cache: cache,
	module: {
		rules: loaders
	},
	entry: {
		main: './src/index.tsx'
    },
  output: {
    filename: '[name].[contenthash].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: {
          chunks: 'initial',
          name: 'bundle',
          priority: -20,
          reuseExistingChunk: true,
        },
        plotly: {
          chunks: 'initial',
          name: 'plotly.js',
          priority: -10,
          reuseExistingChunk: false,
          test: /node_modules\/plotly.js-cartesian-dist\/(.*)\.js/
        }
      }
    }
  },
	resolve: {
		extensions: extensions,
		modules: [
			__dirname,
			path.resolve(__dirname, "src"),
			"node_modules"
        ],
        alias: {
            plotly: 'plotly.js-cartesian-dist'
          }
	},
    plugins: [
      // new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public/index.html'),
            filename: 'table.html',
            inject: 'body',
            inlineSource: '.js$' // embed all javascript and css inline
		}),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/main/,/bundle/,/plotly/])
      ]  
}];