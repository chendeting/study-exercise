const hello = (name: string) => {
    console.log(`hello, ${name}`)
}
hello('typescript')

/**
 * 原始数据类型
 * 
*/

const s: string = 'foot'
const n: number = 100
const b: boolean = true
// 严格模式，所有的数据类型不能为空
// const d: boolean = null // 非严格模式可以

const e: void = undefined
const f: null = null
const g: undefined = undefined
const h: symbol = Symbol() // es5里面内置对象没有symbol, es2015里面有
function stringify(value: any) {
    return JSON.stringify(value)
}

let foo: any = 100
foo = 'sky'

const nums = [110, 120, 130, 140]

const res = nums.find(i => i > 0)
// const aqures = res * res

const num1 = res as number // 类型断言
const num2 = <number>res // jsx下面不可用
const aqures1 = num1 * num1
const aqures2 = num2 * num2
console.log('类型断言:', aqures1, aqures2)

// 函数类型, 返回值为string，添加？变成可选参数，可选参数需要在最后, rest为无限个参数
function func(a: number, b?: number, ...rest: number[]): string {
    return 'ssss'
}

const func2: (a: number, b: number) => string = function (a: number, b?: number, ...rest: number[]): string {
    return 'func2'
}

func(100, 200) // 个数要想通

//接口, 声明对象参数类型
interface Post {
    title: string // 可添加分号或者逗号，或者不要
    content: string
    subTitle?: string //可选成员
    readonly sunmmary?: string //只读成员
}

function printPost(post: Post) {
    console.log(post.title)
    console.log(post.content)
}

printPost({
    title: 'cdt',
    content: 'is a girl'
})

const hello2: Post = {
    title: 'cdt',
    content: 'is a girl',
    sunmmary: 'is 18'
}

// hello2.sunmmary = 'sdsd'

// 动态成员

interface Cache {
    // 属性名为字符串，值为字符串
    [prop: string]: string
}

// const cache: Cache = {}

// cache.age = '18'
// cache.name = 'cdt'

// 类,es6有了专门的类，增强了类的相关语法
class Person {
    // 必须要在类中声明属性
    name: string // = 'init'
    age: number // 必须要有初始值，可以直接等号给值，获取构造函数中赋值
    private sex: string  // 私有成员
    // 受保护的成员,只允许在此类中去访问的成员
    protected gender: boolean
    constructor(name: string, age: number) {
        this.name = name
        this.age = age
        this.sex = 'man'
        this.gender = true
    }

    sayHi (msg: string): void {
        console.log(`I am  ${this.name}, ${msg}`)
    }
}

const tom = new Person('tom', 18)
// console.log(tom.sex)
// console.log(tom.gender)
console.log(tom.name)
console.log(tom.age)

class Student extends Person {
    // 如果被设置成了私有的，那就不能被外部实列化
    private constructor (name: string, age: number) {
        super(name, age)
        console.log(this.gender)
    }
    static create(name: string, age: number) {
        return new Student(name, age)
    }
} 
const jack = Student.create('jack', 18)
// 