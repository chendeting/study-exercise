const path = require('path')
// 启用热加载第二步
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var utils = require('./build/utils')
var vueLoaderConfig = require('./build/vue-loader.conf')
var VueLoaderPlugin = require('vue-loader/lib/plugin');
var config = require('./config')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: './src/main.js',
  output: {
    filename: '[name].[hash].js',
    // filename: 'main.js',
    path: path.join(__dirname, 'dist')
  },
  devServer: {
    port: 3000,
    open: true, //自动打开浏览器
    hot: true, // 启用热加载第一步，热重载、热跟新，页面异步刷新，减少不必要的刷新请求；打补丁，而不是重新编译，减少不必要的代码跟新。
    // contentBase: 'src' // 制定托管的根目录
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css'],
    alias: { // 创建路径别名，有了别名之后引用模块更方便
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
        options: {
          cacheDirectory: resolve('node_modules/.cache/babel-loader')
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', {
          loader: 'less-loader', options: {
            lessOptions: {
              strictMath: true,
              noIeCompat: true,
              paths: [path.resolve(__dirname, 'node_modules')]
            }
          }
        }]
      }
    ]
  },
  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    // 启用热加载第三步
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'cdt Webpack Plugin Sample',
      template: './index.html'
    }),
  ]
}