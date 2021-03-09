const common = require('./webpack.config')
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 自动清除dist目录
const CopyWebpackPlugin = require('copy-webpack-plugin') // 把打包目录拷贝到输出目录

module.exports = merge(common, {
    mode: 'production',
    plugin: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin(['public'])
    ]
})