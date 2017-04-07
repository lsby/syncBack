# syncBack
嗯,这个库可以避免代码出现回调套回调的`回调地狱(callback_hell)`.

## 写法
run(生成器函数, 回调函数);
* 生成器函数的参数是(api).
* 回调函数的参数是(err, data, api).
* 在生成器函数中,在异步函数名前加`yield`,并在其回调函数的位置写对应的回调函数,即可将其变为同步的.其返回的数据是`yield`所在的位置.
    * 如果这个异步函数的回调参数形式是`(err, data)`,则写`api.next`.
    * 如果这个异步函数的回调参数形式是`(data)`,则写`api.nextOne`.
    * 如果这个异步函数的回调参数形式是其他形式,则写一个匿名函数,在匿名函数内调用`api.next`.
        * `api.next`的参数是`(err, data)`,执行之后`api.err`会设置为此处的`err`,`yield`所在的位置会设置为此处的`data`.
* 如果调用的异步函数出错,则`api.err`会被设为异步函数返回的错误信息.你可以通过`if(api.err)`来捕获错误.
* 在生成器函数中可以随意更改`api`属性,这个`api`属性会与回调函数中的`api`参数共享.
* 在生成器函数中可以调用`yield api.return(err, data)`来执行回调函数,这里的参数`err`和`data`和回调函数的参数对应.
    * 如果不调用此语句,回调函数将**不会**执行.
    * 调用此语句后,本句下面的代码将**不会**执行.
* **不要忘了加`yield`**

## 例子
简单的读文件:
```JavaScript
var run = require('sync_back').run;
var fs = require('fs');

run(function* (api) {
    var exists = yield fs.exists('./README.md', api.nextOne); //你可以试着修改文件名来模拟出错的情况
    if (!exists)
        yield api.return('文件不存在');

    var data = yield fs.readFile('./README.md', api.next); //你可以试着修改文件名来模拟出错的情况
    if (api.err)
        yield api.return('读文件失败', api.err);

    yield api.return(null, data);
}, function (err, data) {
    if (err) {
        console.log(err);
        if (data != null)
            console.log(data);
        return;
    }
    console.log('读文件成功');
    console.log(data);
})
```
一个访问数据库的例子(express):
```JavaScript
var run = require('sync_back').run;
var db = require('mongodb').MongoClient

router.post('/api/test', function (req, res, next) {
    run(function* (api) {
        api.conn = yield db.connect(db_config, api.next);
        api.back = res.end;

        var conn = api.conn;
        if (api.err)
            yield api.return({ 'success': false, 'msg': '连接数据库失败' });

        var count = yield conn.collection("testSet").count({}, api.next);
        if (api.err)
            yield api.return({ 'success': false, 'msg': '执行查询语句失败' });

        yield api.return(null, { 'success': true, 'data': { 'count': count } });
    }, function (err, data, api) {
        var conn = api.conn;
        var back = api.back;

        //如果连接成功就关闭连接
        if (conn != null)
            conn.close();

        //如果有错误就返回错误
        if (err) {
            back(json.stringify(err));
            return;
        }

        //如果没有错误就返回数据
        back(json.stringify(data));
    });
})
```

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
    * 至于要不要加类似`promise.all`的功能,之类的...反正也很容易,源码也没几行,各位看官自己写一个加到`api`里就好了.
        * 如果各位看官能读读我的代码,那我真是三生有幸...