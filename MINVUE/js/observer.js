class Observer {
    constructor(data) {
        this.walk(data)
    }
    //
    walk(data) {
        // 判断data是否是对象
        if (!data || typeof data !== 'object') return
        // 遍历对象，并调用defineReative
        Object.keys(data).forEach((key) => {
            this.defineReative(data, key, data[key])
        })
    }
    /*
    * value 属性对应的值，如果不传value，则会出现死循环递归，这里使用了闭包来对value的作用域提升
    */
    defineReative(obj, key, value) {
        let self = this
        // 需要为每个对象都创建一个Dep类，用于收集依赖，并发送通知
        let dep = new Dep()
        // 如果value是对象，把value里面的属性转换为响应式数据
        this.walk(value) // 针对与data对象中参数是对象的，也把对象属性里面的值转换为响应式的
 
        Object.defineProperty(obj, key, {
            enumerable: true, // 可枚举
            configurable: true, // 可遍历
            get() {
                // 当访问属性值时，我们就去收集依赖
                // 需要先判断Dep这个类是否设置了静态属性target，target就是观察者对象，但是target是在watcher类中来添加的
                Dep.target && dep.addSubs(Dep.target)
                return value
            },
            set(newValue) {
                // 判断值是否发生了变化，没有变化就直接返回
                if (newValue === value) return
                // 否则修改data相对应的属性的值
                value = newValue
                // 当 当前属性重新赋值成对象的话，也需要调用walk方法把对象里面的属性变成响应式的，
                // 注意这里还涉及到this的指向，set方法里面的this指向的是data，而不是Observer对象
                self.walk(newValue)
                // 发送通知
                dep.notify()
            }
        })
    }
}
