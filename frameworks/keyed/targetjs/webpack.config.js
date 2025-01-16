const path = require('path');

module.exports = (env = {}) => ({
	mode: 'production',
	entry: path.resolve(__dirname, './src/main.js'),
	output: {
		path: path.resolve(__dirname, './dist'),                
		publicPath: '/dist/'
	},
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    include: path.resolve(__dirname, 'src')       
                }
            ]
        }
});