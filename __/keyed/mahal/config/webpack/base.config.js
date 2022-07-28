const path = require('path');
const MahalPlugin = require('mahal-webpack-loader/lib/plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const rootFolder = path.join(__dirname, '../../');

const isEnvProduction = process.env.NODE_ENV === "production"

module.exports = {
    entry: './src/index.ts',
    devtool: 'source-map',
    mode: process.env.NODE_ENV || "development",
    module: {
        rules: [
            {
                test: /\.mahal?$/,
                // loader: 'mahal-webpack-loader',
                use: {
                    loader: require.resolve('mahal-webpack-loader')
                },
                exclude: /node_modules/
            },
            {
                test: /\.css?$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.ts?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.mahal$/],
                    }
                },
                exclude: /node_modules/,
            },
            // Images
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            // Fonts and SVGs
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.css', '.mahal', '.scss'],
        alias: {
            "~": rootFolder,
            "@": path.join(rootFolder, 'src'),
            "@config": path.join(rootFolder, 'config'),
            "@components": path.join(rootFolder, 'src', 'components')
        },
    },
    output: {
        filename: isEnvProduction ? 'js/[name].js' : 'js/[name].js',
        chunkFilename: isEnvProduction ? 'js/[name].chunk.js' : 'js/[name].chunk.js',
        path: path.resolve(rootFolder, 'dist'),
        publicPath: '/'
    },
    plugins: [
        new MahalPlugin({
            lang: 'ts'
        }),
        new HtmlWebPackPlugin({
            // cache: true,
            // hash: true,
            template: 'src/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [{
                from: './assets/',
                to: ''
            }]
        }),
        // new MiniCssExtractPlugin({
        //     filename: 'css/[name].css',
        //     chunkFilename: 'css/[name].chunk.css',
        // })
    ]
};