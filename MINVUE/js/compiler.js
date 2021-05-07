class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        // 创建完vue实例后，就要立即编译模版，此时需要立即调用compile函数
        this.compile(this.el)
    }

    // 编译模版，处理文本节点和元素节点，即要去循环el元素下所有的节点包括元素节点和文本节点，分别找出来做相应的处理
    compile(el) {
        // childNodes是子节点，childrend是子元素
        let childNodes = el.childNodes  // 是个伪数组
        // 要遍历childNodes，必须将其转换为数组，使用Array.from(),箭头函数不改变this指向
        Array.from(childNodes).forEach(node => {
            // 处理文本节点
            if (this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) { // 处理元素节点
                this.compileElement(node)
            }
            // 为了去处理el更深层次的子节点，还需要判断node是否有子节点，如果有子节点需要去递归调用compile方法
            // 下面判断node节点
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        });
    }
    // 编译元素节点，处理指令

    compileElement(node) {
        console.log(node.attributes)
        // 先获取所有的属性节点，找到‘v-’开头的属性
        // 遍历所有的属性节点
        Array.from(node.attributes).forEach(attr => {
            // 判断是否是指令
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                // v-text --> text，把v-text变成text，即去掉‘v-’
                // 属性的名字
                attrName = attrName.substr(2)
                // 属性的值,即msg
                let key = attr.value
                this.update(node, key, attrName)
            }
        })
    }
    // node节点,key属性的名称,attrName属性的名字，也是方法的前缀
    update(node, key, attrName) {
        // 先获取处理函数
        let updateFn = this[attrName + 'Updater']
        // 由于调用textUpdater方法this指向需要指向compiler，但是此处并没有使用this来调用，所以需要改变this的指向
        // call 方法，第一个参数即为调用updateFn方法的指向对象，这里直接传入this就好
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }
    // 处理 v-text 指令,把对应的值取出来赋给对应的元素，传入node节点和v-text的数据msg的值value
    textUpdater(node, value, key) {
        node.textContent = value
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }
    // 处理 v-model 指令,是更新表单的值，传入node节点和v-text的数据msg的值value
    modelUpdater(node, value, key) {
        node.value = value
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })
        // 双向绑定，其实就是给表单元素注册input事件，即给node注册input事件 
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }

    // 编译文本节点，处理差值表达值
    compileText(node) {
        //  console.dir 以对象形式打印出来
        // console.dir(node)
        // {{ msg }},使用正则表达式来匹配msg
        let reg = /\{\{(.+?)\}\}/ //
        // 获取文本节点内容
        let value = node.textContent
        if (reg.test(value)) { // 文本内容是否能匹配上正则表达式
            // 使用正则的构造函数(RegExp.$1 获取的是第一个分组的内容)来获取分组的内容,key 即为msg, 
            let key = RegExp.$1.trim() // 去掉内容的空格，就得到了{{}}里面的变量名了
            // 把key替换成属性的值，然后再赋值给文本节点,要把差值表达式变换成变量对应的值，key为属性，那么值就是this.vm[key]
            node.textContent = value.replace(reg, this.vm[key])

            // 创建watcher对象,当数据变化时更新视图
            new Watcher(this.vm, key, (newValue) => {
               // 重新赋值
               node.textContent = newValue
            })
        }
    }

    // 判断元素属性是否是指令
    isDirective(attrName) {
        // 即判断属性attrName，是否是以‘v-’开头，是就返回true
        return attrName.startsWith('v-')
    }

    // 判断节点是否是元素节点
    isElementNode(node) {
        // node有nodeType属性，如果是3就是文本节点，如果是1就是元素节点
        return node.nodeType === 1
    }
    // 判断节点是否是文本节点

    isTextNode(node) {
        return node.nodeType === 3
    }
}