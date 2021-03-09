// 运行在node环境下的js，需要遵循CommonJS规则
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin') // 自动清除dist目录
const HtmlWebpackPlugin = require('html-webpack-plugin') // 自动生成使用bundle.js的HTML
const CopyWebpackPlugin = require('copy-webpack-plugin') // 把打包目录拷贝到输出目录
/*
* 把css样式从js文件中提取到单独的css文件中，把css拆分出来用外链的形式引入css文件，将所有的css样式合并为一个css文件。
* 安装@next版本的extract-text-webpack-plugin，拆分为一一对应的多个css文件
**/
const MiniCssExtractPlugin = require('mini-css-extract-plugin') 
const { compilation } = require('webpack')
const { Compilation } = require('webpack')
const webpack = require('webpack')

class MyPlugin { // 插件主要作用是去替换打包后的文件的js 代码前面的注释 ‘/******/ ’
    apply(compile) { // compile是webpack工作中最核心的对象，包含了此次构建的所有配置信息
        console.log('MyPlugin 启动')
        // 第一个参数： 插件名称， 第二个参数：需要挂在到钩子上的函数
        compile.hooks.emit.tap('MyPlugin', compilation => {
            // compilation => 可以理解为此次打包的上下文，所有打包的结果都放在这个上下文中
            for (const name in compilation.assets) {
                //   console.log(name) // 输出文件名称
                //  console.log(compilation.assets[name].source()) // 输出文件内容
                if (name.endsWith('.js')) { // 主要是去查找js文件，做一个过滤
                    const contents = compilation.assets[name].source() // 获取内容
                    const withoutComments = String(contents).replace(/\/\*\*+\*\//g, '') // 正则替换
                    compilation.assets[name] = {
                        source: () => withoutComments,
                        size: () => withoutComments.length // 返回内容的大小，是webpack内部要求的一个方法
                    }
                }
            }
        })
    }
}


module.exports = {
    /*
    *工作模式，简化了webpack的配置复杂程度，是针对不同开发环境的预设的配置
    *默认是production（启用优化模式），
    *development（启用开发模式，优化速度），
    *none（启用原始模式，webpack 内部做不处理）
    */
    mode: 'none', // 工作模式
    entry: './src/main.js', // 入口文件
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'), // 指定文件输出的目录，path必须是绝对路径
        // publicPath: 'dist/' // 网站的根目录，默认为空，dist后面的 / 不能省略
    },
    // 集中配置webpack内部优化功能
    optimization: {
        // 只导出那些外部使用到的成员
        usedExports: true,
        // 开启webpack的代码压缩功能，去压缩掉没有用的代码
        minimize: true,
        // 尽可能的将所有模块合并输出到一个函数中，既提升了运行效率，又减少了代码的体积,是webpack3的一个特性，配合minimize，代码体积又回减少很多
        concatenateModules: true
    },
    // 与sourceMap 相关的功能配置, 
    //生产环境，设置为none，因为Source Map 会暴露源代码， nosource-source-map，可以找到代码位置，不至于暴露源代码
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        // 指定额外的静态资源路径,可以是字符串，也可以是数组 
        contentBase: './public' ,
        hot: true, // 开启热更新，还需要再入一个webpack内置的插件 HotModuleReplacementPlugin
        port: 5000,
        // 添加代理服务配置
        proxy: {
            '/api': {
                // http://localhost:8080/api/users => https://api.github.com/api/users (但是此地址是没有api/，这就需要重写)
                target: 'https://api.github.com',
                 // http://localhost:8080/api/users => https://api.github.com/users 
                pathRewrite: {
                    '^/api': ''
                },
                // 不能使用 localhost:8080 作为请求Github 的主机名，设置为true就会以实际请求的服务主机名去发起请求
                changeOrigin: true
            }
        }
    },
    module: {
        rules: [
            {
                test: /.md$/,
                use: [
                    'html-loader', 
                    './markdown-loader'
                ] // use可以使用模块名称，也可以使用模块路径，与reqiure函数是一样的,是从后到前执行
            },
            {
                test: /\.js$/,
                exclude: /node_modules/, // 除去node_modules下面的js，同上面的\转义字符
                use: {
                    loader: 'babel-loader', // 代替默认加载器，处理 ES6 新特性
                    options: {
                        // 将 @babel/preset-env 的 modules 属性设置为 false，确保不会转换 ES Modules，也就确保了 Tree-shaking 的前提。
                         // babel插件集合,modules: 'commonjs'强制转换为commonJs，则打包是Tree-shaking就不生效了
                         // 最新版本（8.x）的 babel-loader 中，已经自动帮我们关闭了对 ES Modules 转换的插件
                        //  presets: ['@babel/preset-env', { modules: 'commonjs' }]
                         presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /.css$/,
                use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader', 
                {loader: 'postcss-loader', //  为css添加浏览器前缀
                 options: {
                   plugins: [require('autoprefixer')]
                }}]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: {
                    loader: 'url-loader', // 小文件使用Data URLs，减少请求次数，大文件单独提取存放，提高加载速度
                    options: {
                        limit: 10 * 1024, // 10kb,限制为10kb，超过10kb则使用file-loader处理
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'img/[name].[hash:8].[ext]'
                            }
                        }
                    }
                }
            }
        ]
    },
    // 穿件插件实例把它放到plugins这个数组中
    plugins: [
        new CleanWebpackPlugin(),
        // 拆分css
        new MiniCssExtractPlugin({
            filename: '[name].[hash].csss',
            chunkFilename: '[id].css'
        }),
        // 用于生成 index.html 文件
        new HtmlWebpackPlugin({ // 根据配置来生成html模版页面,输出自定义模版内容
            title: 'cdt Webpack Plugin Sample',
            meta: {
                viewport: 'width=device-width'
            },
            template: './src/index.html'
        }),
        // 用于生成 about.html文件
        new HtmlWebpackPlugin({
            filename: 'about.html'
        }),
        // 开发阶段最好不使用这个插件，在上线前才使用
        //因为在开发阶段会频繁重复执行打包任务，如果拷贝的文件比较大，那么打包编译的开销就比较大，降低开发效率
        // new CopyWebpackPlugin([
        //     // 'public/**' // 可以是通配符，或则文件路径
        //     'public'
        // ]),
        new MyPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
}