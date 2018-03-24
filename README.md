# syncBack
* 嗯,这个库可以避免代码出现回调套回调的`回调地狱(callback_hell)`.
* 有人愿意帮我翻译成英文版吗?

# 版本
* 这是2.x版本
* 1.x版本请点击[这里](https://github.com/lsby/syncBack/tree/cbfdf1d77efd921de681a9abe46670aa26f9eabf)

## 特点
* 形式:`sync(gen, <back>)`
* 编写时能避免回调嵌套 像编写同步函数的方法一样(但实际上并不是同步执行 而是异步执行 不会阻塞)
* 对于回调形式是`(err, ...)`的异步函数 当异步函数错误时 外部可以try到
* 支持回调形式非`(err, data)`的异步函数
* sync本身是一个异步的函数 如果在sync内部出现异常或执行结束 sync会以`(err, data)`的形式调用回调函数(如果回调函数存在)
  * 结合这一点 向外层传递异步函数的异常 请参看demo

## 设置
* 生成sync函数时的设置
  * debug:若为`true` 则sync在执行异步函数获得错误或sync内部抛出异常时 会使用`debug`模块 以`syncBack`为名称输出错误或异常信息

## 简单使用
顺序执行异步函数:
```JavaScript
sync(function* (api) {
    var data = yield f1(api.next)
    console.log(data)

    var data = yield f2(api.next)
    console.log(data)
})
```
如果异步函数运行错误会抛出异常:
```JavaScript
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
可以向外层传递异步函数的异常
```JavaScript
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
    * 有其他需求的话(例如类似`promise.all`的运行方式) 请反馈 有空会考虑加
* 有任何意见建议也欢迎交流
