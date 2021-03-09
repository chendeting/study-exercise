// @flow

function sum(a: number, b: number) {
    return a + b
}

sum(100, 120)
sum(100, 3)
/** 
 * 类型注解
 * @flow
*/
let num: number = 100
/** 
 * 原始类型
 * @flow
*/
const a: string = 'foobar'
const b: number = Infinity // NaN // 100
const c: boolean = true // false
const d: null = null
const e: void = undefined
const f: symbol = Symbol()

/** 
 * 数组类型
 * @flow
*/

const arr1: Array<number> = [1, 2, 3, 4]
const arr2: number[] = [1, 2, 3]
const foo: [string, number] = ['12', 5]

const obj1: { foo: string, bar: number } = { foo: 'cdt', bar: 100 }
// 成员可选
const obj2: { foo?: string, bar: number } = { bar: 100 }

// 键值对可选,但是键类型只能是字符串，值也是字符串

const obj3: { [string]: string } = {}

obj3.key1 = 'value1'

/**
 * 函数类型
 * @flow
*/
// 返回void，意思就是没有返回值
function foo1(callback: (string, number) => void) {
    callback('cdt', 18)
}

foo1(function (str, n) {

})

/**
 * 特殊类型
 * @flow
*/
// 字面量类型是为了限制变量必须是某一个值
const x: 'foo' = 'foo' // 只能传入foo字符串的值

//联合类型
const type: 'success' | 'wraning' | 'danger' = 'success'
// type 单独声明一个类型，为参数类型去一个别名
type SringOrNumber = string | number

const y: string | number = 'cdt' // 100


// maybe类型,在基础类型上扩展了null undefined

const gender: ?number = undefined  // 等价于gender: number | null | void = undefined

/**
 * Mixed Any
 * 
 * @flow
 * 
*/
// 混合类型，所有类型的联合类型
function passMixed(value: mixed) {
    if (typeof value === 'string') {
        value.substr(1)
    }
    if (typeof value === 'number') {
        value * value
    }
}
passMixed('string')
passMixed(18)

function passAny(value: any) {
    value.substr(1)
    value * value
}
passAny('cdt')
passAny(19)
// any是弱类型，mixed是强类型

/**
 * 运行环境 API
 * @flow
*/

const element: HTMLElement | null = document.getElementById('app')