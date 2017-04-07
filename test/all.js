var run = require('../index').run;
var assert = require('assert');

function f1(back) {
    setTimeout(function () {
        back(null, '函数1的回调数据');
    }, 0);
}
function f2(back) {
    setTimeout(function () {
        back(null, '函数2的回调数据');
    }, 0);
}
function f3(back) {
    setTimeout(function () {
        back('函数3的错误数据', null);
    }, 0);
}
function f4(back) {
    back(null, '函数4的回调数据');
}

describe('测试', function () {
    it('同步执行两个异步函数', function (done) {
        run(function* (api) {
            var data = '';

            data = yield f1(api.next);
            assert(data == '函数1的回调数据');

            data = yield f2(api.next);
            assert(data == '函数2的回调数据');

            done();
        })
    });
    it('当要执行的函数的回调格式不同时', function (done) {
        run(function* (api) {
            var fs = require('fs');

            var exists = yield fs.exists('./index.js', function (exists) {
                api.next(null, exists);
            });
            assert(exists == true);

            var exists = yield fs.exists('./index.js', api.nextOne);
            assert(exists == true);

            done();
        })
    });
    it('发生错误的情况', function (done) {
        run(function* (api) {
            var data = yield f3(api.next);
            assert(api.err == '函数3的错误数据');

            done();
        })
    });
    it('立刻返回的回调', function (done) {
        run(function* (api) {
            var data = yield f4(api.next);
            assert(data == '函数4的回调数据');

            done();
        })
    });
    it('高并发场景', function (done) {
        var c = 0;
        var testC = 9999;
        for (var i = 0; i < testC; i++) {
            f();
        }

        function f() {
            var t1 = (new Date()).valueOf();
            run(function* (api) {
                var data = yield f1(api.next);
                c++;

                var t2 = (new Date()).valueOf();

                assert(t2 - t1 < 2000);
                if (c == testC)
                    done();
            })
        }
    });
    it('执行回调函数报告数据', function (done) {
        run(function* (api) {
            yield api.return(null, 'data');

            console.log('这里的代码不会执行 用一个永假的断言来保证这一点');
            assert(0 == 1);
        }, function (err, data) {
            assert(err == null);
            assert(data == 'data');
            done();
        });
    });
    it('执行回调函数报告错误', function (done) {
        run(function* (api) {
            yield api.return('err');

            console.log('这里的代码不会执行 用一个永假的断言来保证这一点');
            assert(0 == 1);
        }, function (err, data) {
            assert(err == 'err');
            done();
        });
    });
    it('逻辑和回调共享api对象', function (done) {
        run(function* (api) {
            api.test = 'test';
            api.return();
        }, function (err, data, api) {
            assert(api.test == 'test');
            done();
        })
    });
    it('综合使用', function (done) {
        run(function* (api) {
            var data1 = yield f1(api.next);
            if (api.err)
                yield api.return(api.err);
            assert(data1 == '函数1的回调数据');

            var data2 = yield f2(api.next);
            if (api.err)
                yield api.return(api.err);
            assert(data2 == '函数2的回调数据');

            yield api.return(null, [data1, data2]);
        }, function (err, data) {
            assert(err == null);
            assert(data.length == 2);
            assert(data[0] == '函数1的回调数据');
            assert(data[1] == '函数2的回调数据');
            done();
        });
    });
    it('综合使用2', function (done) {
        run(function* (api) {
            var data1 = yield f1(api.next);
            if (api.err)
                yield api.return(api.err);
            assert(data1 == '函数1的回调数据');

            var data2 = yield f3(api.next);
            if (api.err)
                yield api.return(api.err);

            console.log('这里的代码不会执行 用一个永假的断言来保证这一点');
            assert(0 == 1);
        }, function (err, data) {
            assert(err == '函数3的错误数据');
            done();
        });
    });
});