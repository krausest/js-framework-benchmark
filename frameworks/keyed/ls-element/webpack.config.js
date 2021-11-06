var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const commonConfig = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    entry: './src/main.tsx',
}

const devConfig = {
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        open: true,
        overlay: true,
        port: 9000
    },
    mode: 'development',
    devtool: 'inline-source-map',
    ...commonConfig
}

const prodConfig = {
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        open: true,
        overlay: true,
        port: 9000
    },
    mode: 'production',
    devtool: false,
    optimization: {
        minimizer: [
            new TerserPlugin(),
        ],
    },
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    ...commonConfig
}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        return devConfig;
    } else {
        return prodConfig;
    }
};