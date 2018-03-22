# syncBack
* 嗯,这个库可以避免代码出现回调套回调的`回调地狱(callback_hell)`.
* 有人愿意帮我翻译成英文版吗?

# 版本
* 这是2.x版本
* 1.x版本请点击[这里](https://github.com/lsby/syncBack/tree/cbfdf1d77efd921de681a9abe46670aa26f9eabf)

## 使用
1. 在异步函数前加`yield`
2. 在回调函数上写`api.next`

## 特点
* 简单的顺序化调用异步函数 避免回调嵌套
* 对于回调形式是`(err,...)`的异步函数 当异步函数错误时 外部可以try到
* 支持回调形式非`(err,data)`的异步函数
* 使用本模块封装的异步函数 在任何地方抛出异常都可以被try到

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
更多例子在`demo`文件夹中,可直接运行.

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
    * 如果实际使用中不能满足需求的话就更新.
