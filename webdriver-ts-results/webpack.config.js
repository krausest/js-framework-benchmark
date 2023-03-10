var HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var InlineChunkHtmlPlugin = require('inline-chunk-html-plugin');

var path = require('path')
var cache = true;
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
    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
	}
];
var extensions = [
	'.ts', '.tsx', '.ts', '.js'
];

module.exports = [{
	cache: true,
	module: {
		rules: loaders
	},
	entry: {
		main: './src/index.tsx',
  },
  output: {
    publicPath: '',
    filename: '[name].[contenthash].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },      
        plotly: {
          test: /[\\/]node_modules[\\/]plotly.*[\\/]/,
          name: 'plotly',
          chunks: 'all',
          priority: 20
        },      
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
            inject: true,
		}),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/main|vendor|BoxPlotTable/])
    ]  
}];