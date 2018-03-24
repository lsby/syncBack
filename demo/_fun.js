exports.f1 = function (back) {
    setTimeout(function () {
        back(null, 'f1')
    }, 200);
}
exports.f2 = function (back) {
    setTimeout(function () {
        back(null, 'f2')
    }, 100);
}
exports.f3 = function (back) {
    setTimeout(function () {
        back('f3_err')
    }, 100);
}
exports.f4 = function (back) {
    setTimeout(function () {
        back(null, 'f4_1', 'f4_2')
    }, 100);
}
exports.f5 = function (back) {
    setTimeout(function () {
        back('f5')
    }, 100);
}
exports.f6 = function (back) {
    var sync = require('../index')({ debug: true })
    sync(function* (api) {
        console.log('a')
        yield exports.f1(api.next)
        console.log('b')
        throw 'f6_err'
        console.log('c')
        yield exports.f2(api.next)
        console.log('d')
        back(null)
    }, back)
}