var sync = require('../index')({ debug: true })
var { f6 } = require('./_fun')

sync(function* (api) {
    console.log('本模块封装的异步函数可以在任何抛出异常的地方被try到')
    console.log('f6是一个用本模块封装的异步函数 它会直接抛出一个异常')
    console.log('而这个异常会在这里被try到')

    try {
        yield f6(api.next)
    } catch (e) {
        console.log(e)
    }
})