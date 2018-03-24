var { f1, f2 } = require('./_fun')
var sync = require('../index')({ debug: true })

sync(function* (api) {
    var data1 = yield f1(api.next)
    var data2 = yield f2(api.next)

    return data1
}, function (err, data) {
    if (err)
        return console.log(err)
    console.log(data)
})