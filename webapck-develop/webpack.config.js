const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 自动清除dist目录
const HtmlWebpackPlugin = require('html-webpack-plugin') // 自动生成使用bundle.js的HTML
const CopyWebpackPlugin = require('copy-webpack-plugin') // 把打包目录拷贝到输出目录
// env 是通过cli传递的环境名参数，argv是在运行cli过程当中传递的所有参数
module.exports = (env, argv) => {
    const config = {
        mode: 'development', // 工作模式
        entry: './src/main.js', // 入口文件
        output: {
            filename: 'js/bundle.js',
            path: path.join(__dirname, 'dist'),
        },
        // 与sourceMap 相关的功能配置, 
        //生产环境，设置为none，因为Source Map 会暴露源代码， nosource-source-map，可以找到代码位置，不至于暴露源代码
        devtool: 'cheap-module-eval-source-map',
        devServer: {
            // 指定额外的静态资源路径,可以是字符串，也可以是数组 
            contentBase: './public',
            hot: true, // 开启热更新，还需要再入一个webpack内置的插件 HotModuleReplacementPlugin
            port: 5000,
            // 添加代理服务配置
            proxy: {}
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
                    use: {
                        loader: 'babel-loader', // 代替默认加载器，处理 ES6 新特性
                        options: {
                            presets: ['@babel/preset-env'] // babel插件集合
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jpe?g|gif)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'img',
                            name: '[name].[ext]'
                        }
                    }
                },
                {
                    test: /\.png$/,
                    use: {
                        loader: 'url-loader', // 小文件使用Data URLs，减少请求次数，大文件单独提取存放，提高加载速度
                        options: {
                            limit: 10 * 1024 // 10kb,限制为10kb，超过10kb则使用file-loader处理
                        }
                    }
                }
            ]
        },
        // 穿件插件实例把它放到plugins这个数组中
        plugins: [
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
            new CleanWebpackPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ]
    }
    if (env === 'production') {
        config.mode = 'production'
        config.devtool = false
        config.plugins = [
            ...config.plugins,
            new CleanWebpackPlugin(), 
            new CopyWebpackPlugin([
                // 'public/**' // 可以是通配符，或则文件路径
                'public'
            ])
        ]
    }

    return config
}