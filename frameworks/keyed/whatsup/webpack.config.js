const path = require('path') 

module.exports = {
    entry: {
        main: './src/main.tsx',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        sourceMapFilename: '[file].map',
    },
    resolve: {
        modules: [path.resolve(__dirname, './src'), path.resolve(__dirname, 'node_modules')],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    resolveLoader: {
        modules: [path.resolve(__dirname, 'node_modules')],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
        ],
    },
}
