# syncBack
嗯,这个库可以避免代码出现回调套回调的`回调地狱(callback_hell)`.
ps:有人愿意帮我翻译成英文版吗?

## 使用
在一般函数前加`yield`,然后在回调函数上写`api.next`即可.

## 例子
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
对于回调函数非`(err,data)`形式的异步函数:
```JavaScript
sync(function* (api) {
    console.log('(err,data1,data2)')
    var data = yield f4(function (err, data1, data2) {
        if (err)
            return api.next(err)
        api.next(null, {
            data1: data1,
            data2: data2
        })
    })
    console.log(data)

    console.log('(data)')
    var data = yield f5(function (data) {
        api.next(null, data)
    })
    console.log(data)
})
```
例子在`demo`文件夹中,可直接运行.

## 兼容性
生成器函数和`yield`关键字都是`ES6`标准的特性.所以只能用在支持`ES6`的环境中.

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
    * 有bug会修复(如果有能力).
    * 至于要不要加类似`promise.all`的功能,之类的...我还没有想好调用形式...
