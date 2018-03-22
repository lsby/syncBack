var sync = require('../index')({ debug: true })
var { f3 } = require('./_fun')

sync(function* (api) {
    console.log('这里演示异步函数出错的情况')
    console.log('通常 异步函数的回调参数应当是(err,data) 若err不为null 则认为异步函数出错')

    console.log('开始执行f3 f3是一个模拟报错的异步函数')
    console.log('这样这里会产生一个异常 可以被try')
    console.log('如果开启了本模块的debug模式 会使用debug模块输出这个信息')

    try {
        yield f3(api.next)
    } catch (e) {
        console.log(e)
    } finally {
        console.log('finally')
    }
    console.log('end')
})