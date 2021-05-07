class Watcher {
    constructor(vm, key, cb) {
        this.vm  = vm
        // data中的属性名称
        this.key = key
        //  创建对象时传入的回调函数，负责更新视图
        this.cb = cb
        // 把watcher对象记录到Dep类的静态属性target（target的作用就是把当前的watcher对象记录下来）
         Dep.target = this
        // 触发get方法，再get方法中调用addSubs，将当前的watcher对象添加到dep中来
        // 访问属性的时候就会去触发它的get方法
        this.oldValue = vm[key]
        // 将当前的watcher对象添加到dep中之后，需要把Dep的target置空，以防止将来重复添加
        Dep.target = null
    }
    // 当数据发生变化时更新视图
    update () {
        // 根据属性获取相应的最新的值
        let newValue = this.vm[this.key]

        // 判断新值与旧值是否相等，如果一样则不更新视图
        if (this.oldValue === newValue) {
            return
        }
        // 否则使用新的值，再调用回调函数更新视图
        this.cb(newValue)
    }
}