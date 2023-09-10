import HtmlWebpackPlugin from 'html-webpack-plugin';
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
import InlineChunkHtmlPlugin from 'inline-chunk-html-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loaders = [
	{
		test: /\.tsx?$/,
		loader: 'ts-loader',
		exclude: /node_modules/,
    options: {
        configFile: "tsconfig.prod.json"
    }
	},
	{
		test: /\.css$/,
    use: ["style-loader", "css-loader" ],
	}
];

/** @type {import("webpack").Configuration} */
export default [{
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
		extensions: [".js", ".ts", ".tsx"],
	},
    plugins: [
      // new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            filename: 'table.html',
            inject: true,
		}),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/main|vendor|BoxPlotTable/])
    ]  
}];