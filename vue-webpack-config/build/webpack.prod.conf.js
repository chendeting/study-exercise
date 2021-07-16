var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var {merge} = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('terser-webpack-plugin');
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const AutoDllPlugin = require('autodll-webpack-plugin');

var env = config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    //webpack4不再需要UglifyJsPlugin，设定optimization.minimizer为true即可
    //production mode下面自动为true
    minimize: true,
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: false,
      cacheGroups: {
        elementui: {
          chunks: "initial",
          name: "chunk-elementui", // 单独将 elementUI 拆包
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          priority: 90 // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
        },
        libs: {
          chunks: "initial", // 只打包初始时依赖的第三方
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 40
        },
        commons: {  // 抽离自己写的公共代码
          chunks: "async",  // async针对异步加载的chunk做切割，initial针对初始chunk，all针对所有chunk。
          name: "common", // 打包后的文件名，任意命名
          test: /[\\/]src[\\/]views/,
          minChunks: 1,//最小引用2次
          minSize: 30000, // 只要超出30000字节就生成一个新包
          priority: 30,
        },
        //将多个css chunk合并成一个css文件
        styles: {
          name: 'styles',
          test: /\.(less|scss|css)$/,
          chunks: 'all',
          minChunks: 2,
          priority: -10,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        terserOptions: {
          compress: {
            // 关键代码
            warnings: true,
            drop_debugger: true,
            drop_console: true
          }
        }
      }),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          autoprefixer: {disable: true},
          discardComments: {removeAll: true},
          canPrint: true,
          // 避免 cssnano 重新计算 z-index
          safe: true
        }
      })
    ],
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash:7].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash:7].js')
  },
  externals: {
    BMap: 'BMap',
    Bimsop: 'Bimsop',
    // 'echarts': 'echarts',
    // 'echarts-gl': 'echarts-gl',
    // 'element-ui': 'element-ui',
    // 'vue': 'vue',
    // 'vue-router': 'vue-router',
    // 'vuex': 'vuex',
    // 'vue-types': 'vue-types',
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env,
      'staticPath': JSON.stringify(config.build.assetsPublicPath + config.build.assetsSubDirectory),
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash:7].css'), // 注意这里使用的是contenthash，否则任意的js改动，打包时都会导致css的文件名也跟着变动
      chunkFilename: utils.assetsPath('css/[name].[contenthash:7].css'),
    }),
    // 剥离除 "en" 以外的所有语言环境。
    // new MomentLocalesPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      path: config.build.assetsPublicPath + config.build.assetsSubDirectory,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // chunksSortMode: 'dependency'
    }),
    new HardSourceWebpackPlugin(),
    // new AutoDllPlugin(dllConfig),
    // copy custom static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: config.build.assetsSubDirectory
        }
      ]
    })
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
            '\\.(' +
            config.build.productionGzipExtensions.join('|') +
            ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
      })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
