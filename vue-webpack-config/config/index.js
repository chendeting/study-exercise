// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'), // 模板
    assetsRoot: path.resolve(__dirname, '../dist'), // 打包后文件要存放的路径
    assetsSubDirectory: 'static', //  除了 index.html 之外的静态资源要存放的路径，
    assetsPublicPath: '/', // 代表打包后，index.html里面引用资源的的相对地址
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    cssSourceMap: false,
    loginHost: ''
  },
  devServer: {
    compress: true,
    port: 3103,
    open: true,
    hot: true,
    // inline: false,
    // lazy: true,
    // filename: "bundle.js",
    disableHostCheck: true, // 绕过主机检查
    stats: 'errors-only',
    watchOptions: {
      ignored: '/node_modules/'
    },
    proxy: {
      "testcase/*": {
        target: 'http://127.0.0.1:8901', // target host
        changeOrigin: true,               // needed for virtual hosted sites
        ws: true
      }
    }
  }
}
