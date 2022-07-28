const { merge } = require('webpack-merge')
const baseConfig = require('./base.config')

const prod = merge(baseConfig, {
    mode: 'production',
    devtool: false,
    output: {
        publicPath: 'dist/',
    },
})

module.exports = prod;