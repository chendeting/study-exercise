/*每个webpack的loader都需要导出一个函数，
* 1、这个函数则是对我们需要加载到的资源，对其进行处理和加工的过程
* 2、输入就是加载到的文件的内容
* 3、输出就是此次加工过后的结果
*/ 
const marked = require('marked')

module.exports = source => {
  // console.log(source)
  // return 'console.log("hello ~~ cdt")' // 必须返回一个标准的javaScript 代码，不然会报错

  const html = marked(source)
  // 1、返回一个标准js，使用JSON.stringify(html)处理，html内部的引号和换行符都会被转译过来
  // return `module.exports = ${JSON.stringify(html)}`
  // 2、返回html字符串，使用其他的loader去处理，交给下一个loader 处理
  console.log(html)
  return html 
}