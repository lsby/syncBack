var sync = require('../index')({ debug: true })
var { f4, f5 } = require('./_fun')

sync(function* (api) {
    console.log('这里演示对于回调函数形式不为(err,data)的异步函数的处理方式')

    console.log('开始执行f4 f4的回调函数形式是(err,data1,data2)')
    var data = yield f4(function (err, data1, data2) {
        if (err)
            return api.next(err)
        api.next(null, {
            data1: data1,
            data2: data2
        })
    })
    console.log('f4执行完毕 结果是')
    console.log(data)

    console.log('开始执行f5 f5的回调函数形式是(data)')
    var data = yield f5(api.nextOne)
    console.log('f5执行完毕 结果是')
    console.log(data)
})