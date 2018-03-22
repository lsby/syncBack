var sync = require('../index')({ debug: true })

exports.f1 = function (back) {
    setTimeout(function () {
        back(null, 'f1')
    }, 1000);
}
exports.f2 = function (back) {
    setTimeout(function () {
        back(null, 'f2')
    }, 2000);
}
exports.f3 = function (back) {
    setTimeout(function () {
        back('f3_err')
    }, 1000);
}
exports.f4 = function (back) {
    setTimeout(function () {
        back(null, 'f4_1', 'f4_2')
    }, 1000);
}
exports.f5 = function (back) {
    setTimeout(function () {
        back('f5')
    }, 1000);
}
exports.f6 = function (back) {
    sync(function* (api) {
        throw 'f6_err'
    })
}