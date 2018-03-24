For the readme in English, pull down the page please.

# syncBack
* 嗯,这个库可以避免代码出现回调套回调的`回调地狱(callback_hell)`.
* 有人愿意帮我翻译成英文版吗?

# 版本
* 这是2.x版本
* 1.x版本请点击[这里](https://github.com/lsby/syncBack/tree/cbfdf1d77efd921de681a9abe46670aa26f9eabf)

## 简介
* 形式:`sync(gen, <back>)`
* 能避免回调地狱 只需要一点小技巧即可像编写同步函数一样编写流程(但实际上并不是同步执行 而是异步执行 不会阻塞)
* 对于回调形式是`(err, ...)`的异步函数 当异步函数错误时 外部可以try到
* 支持回调形式非`(err, data)`的异步函数
* `sync`本身是一个异步的函数 如果在`sync`内部出现异常或执行结束 `sync`会以`(err, data)`的形式调用回调函数(如果回调函数存在)
  * 结合这一点 可以实现向外层传递异步函数的异常 请参看`demo`

## 设置
* 生成sync函数时的设置
  * `debug`:若为`true` 则sync在执行异步函数获得错误或`sync`内部抛出异常时 会使用`debug`模块 以`syncBack`为名称输出错误或异常信息

## 使用
顺序执行异步函数:
```JavaScript
var sync = require('sync_back')({ debug: true })
sync(function* (api) {
    var data = yield f1(api.next)
    console.log(data)

    var data = yield f2(api.next)
    console.log(data)
})
```
如果异步函数运行错误会抛出异常:
```JavaScript
var sync = require('sync_back')({ debug: true })
sync(function* (api) {
    try {
        yield f3(api.next)
    } catch (e) {
        console.log(e)
    } finally {
        console.log('finally')
    }
    console.log('end')
})
```
对于回调函数非`(err, data)`形式的异步函数也能支持
```JavaScript
var sync = require('sync_back')({ debug: true })
sync(function* (api) {
    var data = yield f4(function (err, data1, data2) {
        if (err)
            return api.next(err)
        api.next(null, {
            data1: data1,
            data2: data2
        })
    })

    var data = yield f5(function (data) {
        api.next(null, data)
    })
})
```
可以使用`sync`包装异步函数 使异步函数可以向外层传递异常
```JavaScript
var sync = require('sync_back')({ debug: true })
function (back) {
    sync(function* (api) {
        ...
        throw 'err'
        ...
        back(null)
    }, back)
}

sync(function* (api) {
    ...
    try {
        yield f(api.next)
    } catch (e) {
        ...
    }
    ...
})
```

更多例子在`demo`文件夹中,可直接运行.

## 兼容性
`生成器函数`和`yield`关键字都是`ES6`标准的特性.所以只能用在支持`ES6`的环境中.

## 问题
* 为什么不用co?
    * ...
* 为什么不用promise?
    * ...
* 为什么不用RxJS?
    * ...
* 为什么不用$%^&*?
    * 对不起我错了...我还是喜欢这样的写法...
* 还会更新吗?
    * 有bug请反馈 会尽力修
    * 有其他需求或建议(例如类似`promise.all`的运行方式)的话 请反馈 有空会考虑加
    * 欢迎pullRequest

---
My English is not very good.

These are machine translations.Is anyone willing to help me optimize this translation?

# syncBack
* Well, this library can avoid the `callback_hell` in the code callback callback.

## Version
* This is version 2.x
* Version 1.x click [here](https://github.com/lsby/syncBack/tree/cbfdf1d77efd921de681a9abe46670aa26f9eabf)

## Introduction
* `sync(gen, <back>)`
* Avoid callback hell and write your logic like writing synchronous code.(But it doesn't block the code from running, so it can also enjoy the advantages of asynchronous)
* For asynchronous functions whose callback form is `(err, ...)`, when the asynchronous function is wrong, the external can use `try`
* Supports callbacks in asynchronous functions that are not `(err, data)`
* `sync` is itself an asynchronous function. If an exception occurs inside `sync`, or if `sync` ends normally, `sync` will call the callback function as `(err, data)` (if the callback function exists)
  * In conjunction with this, you can pass an exception of the asynchronous function to the outside, see `demo`

## Set
* Setting when generating `sync` function
  * `debug`:If `true`, `sync` will use the `debug` module to output error or exception information with the name `syncBack` when executing an async function to get an error or throw an exception inside `sync`.

## Use
Execute asynchronous functions sequentially:
```JavaScript
var sync = require('sync_back')({ debug: true })
sync(function* (api) {
    var data = yield f1(api.next)
    console.log(data)

    var data = yield f2(api.next)
    console.log(data)
})
```
Asynchronous function throws an exception when it returns an error:
```JavaScript
var sync = require('sync_back')({ debug: true })
sync(function* (api) {
    try {
        yield f3(api.next)
    } catch (e) {
        console.log(e)
    } finally {
        console.log('finally')
    }
    console.log('end')
})
```
Also supports asynchronous functions in the form of callback functions other than `(err, data)`
```JavaScript
var sync = require('sync_back')({ debug: true })
sync(function* (api) {
    var data = yield f4(function (err, data1, data2) {
        if (err)
            return api.next(err)
        api.next(null, {
            data1: data1,
            data2: data2
        })
    })

    var data = yield f5(function (data) {
        api.next(null, data)
    })
})
```
By using the `sync` wrapper async function, you can make an async function pass an exception to the outer layer
```JavaScript
var sync = require('sync_back')({ debug: true })
function (back) {
    sync(function* (api) {
        ...
        throw 'err'
        ...
        back(null)
    }, back)
}

sync(function* (api) {
    ...
    try {
        yield f(api.next)
    } catch (e) {
        ...
    }
    ...
})
```

The examples that can be run are in the `demo` folder.

## Compatibility
The `generator function` and `yield` keywords are all features of the `ES6` standard, so they can only be used in environments that support `ES6`.

## Problem
* Why not to use `Co`?
  * Well…
* Why no to use `Promise`?
  * Err…
* Why not to use `RxJS`?
  * Hehe…
* Why not to use blablabla…?
  * Okay, that my mistake… I like this style.
* Will it be updated in the future?
  * If there is a bug, I will try my best
  * If there are other needs or suggestions (such as the operation of `promise.all`), please give me feedback.
  * Welcome to `pullRequest`