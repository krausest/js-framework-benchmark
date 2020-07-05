const path = require('path')

module.exports = (env = {}) => ({
    mode: 'production',
    entry: path.resolve(__dirname, './src/main.js'),
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/'
    },
    
    module: {
        rules: [{
            test: /.sexy$/i,
            use: [{
                loader: 'sexy-loader',
                options: {
					path: '../components',
					styles: false,
					// pages: '../pages',
					// layouts: '../layouts',
                }
            }]
        }, ]
    },
    plugins: [

    ],
})