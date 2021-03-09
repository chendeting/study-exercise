const webpack = require('webpack')

module.exports = {
    mode: 'none',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js'
    },
    plugins: [
        // 每一个键值对都会被注入到代码当中
        new webpack.DefinePlugin({
            // API_BASE_URL: '"https://api.example.com"' // 传入js代码，这里传入的是js字面量的字符串
            API_BASE_URL: JSON.stringify('https://api.example.com') // 传入js代码，这里传入的是js字面量的字符串
        })
    ]
}