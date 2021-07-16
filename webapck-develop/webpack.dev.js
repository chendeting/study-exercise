// 启用热加载第二步
const Webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
module.exports = WebpackMerge(webpackConfig,{
  mode:'development',
  devtool:'cheap-module-eval-source-map',
  devServer:{
    port:3000,
    open: true, //自动打开浏览器
    hot:true, // 启用热加载第一步，热重载、热跟新，页面异步刷新，减少不必要的刷新请求；打补丁，而不是重新编译，减少不必要的代码跟新。
    contentBase:'../dist' // 制定托管的根目录
  },
  plugins:[
    // 启用热加载第三步
    new Webpack.HotModuleReplacementPlugin()
  ]
})