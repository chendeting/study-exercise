class Vue {
    constructor(options) {
        // 在构造函数中设置属性
        /**
         * 1、通过属性保存选项的数据
         * 2、把data中的属性转换为getter/setter，并注入到Vue实例中
         * 3、调用observer对象，监听数据变化
         * 4、调用complier对象，解析指令和差值表达式
        */
        // 1、通过属性保存选项的数据
        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
        // 2、把data中的属性转换为getter/setter，并注入到Vue实例中
        this._proxyData(this.$data)
        // 3、调用observer对象，监听数据变化
        new Observer(this.$data)
        // 4、调用complier对象，解析指令和差值表达式,只需要传入vue的实例
        new Compiler(this)
    }
    _proxyData(data) {
        // 遍历data中的所有属性,Object.keys(data)能获取到所有属性并返回一个数组形式
        /**
         * 1、注意这里使用的是箭头函数，不会改变this的指向，谁调用它就指向谁，这里是指向vue的实例
         * 2、注意这里使用的是function函数，则this的指向就会变成window
         */
        Object.keys(data).forEach(key => {
            // 把data中的属性转换为getter/setter，并注入到Vue实例中
            Object.defineProperty(this, key, {
                enumerable: true, // 可枚举
                configurable: true, // 可遍历
                get() {
                    return data[key]
                },
                set(newValue) {
                    console.log('打印this', this)
                    // 判断值是否发生了变化，没有变化就直接返回
                    if (newValue === data[key]) return
                    // 否则修改data相对应的属性的值
                    data[key] = newValue
                }
            })
        })
    }

}