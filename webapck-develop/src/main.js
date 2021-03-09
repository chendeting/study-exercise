import about from './about.md'
import createHeading from './heading.js'
import './main.css'
import icon from './bigScreen.png'
const log = console.log
log('ccccccc')
const heading = createHeading()
document.body.append(heading)
// console.log(about)

const img = new Image()
img.src = icon
img.width = 400
img.height = 400
document.body.append(img)
const editor = document.createElement('textarea')
editor.classList.add('editor')
document.body.append(editor)

// ===================== fatch proxy api example =======================
 const ul = document.createElement('ul')
 document.body.append(ul)
 // 跨域请求，虽然Github 支持 CORS， 但是不是每个服务端都应该支持。
  //  fetch('https://api.github.com/users')
   fetch('/api/users')
   .then(res => res.json())
   .then(data => {
       data.forEach(element => {
           const li = document.createElement('li')
           li.textContent = element.login
           ul.append(li)
       });
   })


   let lastHeading = heading // 先保存一下heading
   module.hot.accept('./heading', () => {
       console.log('heading 模块更新了，需要这里手动处理热替换逻辑！')
       const value = lastHeading.innerHTML
       document.body.removeChild(lastHeading) // 先移除
       const newHeading = createHeading() // 获取新的内容
       newHeading.innerHTML = value
       document.body.appendChild(newHeading) // 更新在界面上
       lastHeading = newHeading
   })