class Dep {
    constructor() {
        // 存储所有观察者
        this.subs = []
    }
    // 添加观察者，约定所有观察者都有update的方法
    addSubs(sub) {
        // 先判断传递过来的参数是否是观察者
        if (sub && sub.update) {
            this.subs.push(sub)
        }
    }
    // 发送通知,遍历所有的观察者，然后去调用他的update方法，然后去更新视图
    notify() {
        this.subs.forEach(sub => {
           sub.update()
        })
    }
}