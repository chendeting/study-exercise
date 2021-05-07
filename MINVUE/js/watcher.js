class Watcher {
    constructor(vm, key, cb) {
        this.vm  = vm
        // data中的属性名称
        this.key = key
        // 
        this.cb = cb
        this.oldValue = vm[key]
    }
}