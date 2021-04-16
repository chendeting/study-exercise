const path = require('path')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 自动清除dist目录
const CopyWebpackPlugin = require('copy-webpack-plugin') // 把打包目录拷贝到输出目录
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = WebpackMerge(webpackConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [
        // new CopyWebpackPlugin(['public'])
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../public'),
            to: path.resolve(__dirname, '../dist')
        }]),
        new CleanWebpackPlugin()
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({//压缩js
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCssAssetsPlugin({})
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                libs: {
                    name: "chunk-libs",
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: "initial" // 只打包初始时依赖的第三方
                }
            }
        }
    }
})
