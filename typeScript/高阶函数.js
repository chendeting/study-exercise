// 高阶函数--函数作为参数
// ForEach 循环数组，做某些些事情

function forEach(array, fn) {
    for(let i = 0; i < array.length; i++) {
        fn(array[i])
    }
}

let arr1 = [1, 3, 4, 5, 6, 8, 9];
forEach(arr1, function(item) {
    console.log('打印元素', item)
})


// filter 过滤函数,返回新的数组

function filter(array, fn) {
   let reslut = []
   for(let j = 0; j < array.length; j++){
       if(fn(array[j])){
           reslut.push(array[j])
       }
   }
   return reslut;
}
// 过滤偶数
let arr2 = [1, 3, 4, 5, 6, 8, 9];

let r = filter(arr2, function(item) {
  return item % 2 === 0
})

console.log('打印偶数数组', r)

// 函数作为返回值，模拟once函数，只执行一次函数

function once(fn) {
    let done = false
    return function() {
        if(!done) {
            done = true
            return fn.apply(this, arguments)
        }
    }
}

const pay = once(function(money){
    console.log('支付了:'+ money + 'RMB')
})
const pay1 = once(function(money){
    console.log('pay1支付了:'+ money + 'RMB')
})

pay(8) // 第一次执行once函数，done就置为了true
pay(8)
pay1(9)// 从新赋值函数，第一次执行once函数，done就置为了true
pay1(9)
pay1(10)

once(function(m) {
  console.log(`支付了：¥${6}元`)
})() // 返回一个函数，并立即执行返回的函数
once(function(m) {
    console.log(`支付了：¥${9}元`)
})()

// 对不同级别员工生成一个计算总工资的函数（绩效+基本工资）
function makeSalary(base) {
    return function (performance) {
        return base + performance
    }
}
// 级别1(基本工资12000)员工的工资
let level1 = makeSalary(12000)
// 级别2(基本工资15000)员工的工资
let level2 = makeSalary(15000)
console.log('级别1(基本工资12000)员工的工资:', level1(6000))
console.log('级别2(基本工资15000)员工的工资:', level2(8000))