var sync = require('../index')({ debug: true })
var { f1, f6 } = require('./_fun')

sync(function* (api) {
    console.log(1)
    yield f1(api.next)
    console.log(2)

    try {
        yield f6(api.next)
    } catch (e) {
        console.log(e)
    }

    console.log(3)
    yield f1(api.next)
    console.log(4)
})