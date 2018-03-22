var sync = require('../index')({ debug: true })
var { f1, f2 } = require('./_fun')

sync(function* (api) {
    console.log('这里演示两个异步函数的依次执行')

    console.log('开始执行f1')
    var data = yield f1(api.next)
    console.log('结束执行f1 结果是' + data)

    console.log('开始执行f2')
    var data = yield f2(api.next)
    console.log('结束执行f2 结果是' + data)
})