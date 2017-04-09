For the readme in English, pull down the page please.

# syncBack
嗯,这个库可以避免代码出现回调套回调的`回调地狱(callback_hell)`.

## 写法
run(生成器函数, 回调函数);
* 生成器函数的参数是(api).
* 回调函数的参数是(err, data, api).
* 在生成器函数中,在异步函数前加`yield`,并在其回调函数的位置写`api`参数内提供的回调函数,即可变为同步调用.其返回的数据是`yield`所在的位置.
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
    * 至于要不要加类似`promise.all`的功能,之类的...我还没有想好调用形式...

---

# SyncBack
*I Just can speak poor English, so maybe the content may have many faults. Just take it easy…*

Well… This repository can help you to avoid the Callback Hell.
 
## How to use?
`run(<generator_function>, <callback_function>);`

- Generator function contain argument `api`.
- Callback function contain arguments `err, data, api`.
- If you want to use a synchronous function, just add `yield` at the front of the name of asynchronous function, then announce the callback function. The value that returned will show you where is the `yield`.
	- For the function have `(err, data)` arguments, just code `api.next`
	- For the function have `(data)` argument, just code `api.nextOne`
	- For other shapes of argument(s), you need to announce an anonymous function, and call `api.next` inside this function.
		- The parameters of `api.next` as like `(err, data)`. After the function called, `api.err` will be set as `err`, `yield` will be set as `data`.
- `api.err` will store the error info returned by synchronous function, if you call the synchronous function mistakenly. You can catch the error by call `if(api.err)`.
- In generator function, you can operate `api` as you like. The `api` will become the `api` parameter of callback function.
- In generator function, you can call `yield api.return(err, data)` to run the callback function. The parameters, `err` and `data`, is correspondenced with the parameters of the callback function.
	- The callback function will *NOT* be run if you never call this statement.
	- The statements after `yield api.return(err, data)` will *NOT* be run.
- DO NOT FORGET `yield`. He will feel lonely when you forget him. :-P

## Sample
Read file:

```JavaScript
var run = require('sync_back').run;
var fs = require('fs');

run(function* (api) {
    var exists = yield fs.exists('./README.md', api.nextOne); // you can change the filename to simulate the situation of error.
    if (!exists)
        yield api.return('File does not exist.');

    var data = yield fs.readFile('./README.md', api.next); // you can change the filename to simulate the situation of error.
    if (api.err)
        yield api.return('Unable to read the file.', api.err);

    yield api.return(null, data);
}, function (err, data) {
    if (err) {
        console.log(err);
        if (data != null)
            console.log(data);
        return;
    }
    console.log('Done!');
    console.log(data);
})
```

Access database (with Express):

```JavaScript
var run = require('sync_back').run;
var db = require('mongodb').MongoClient

router.post('/api/test', function (req, res, next) {
    run(function* (api) {
        api.conn = yield db.connect(db_config, api.next);
        api.back = res.end;

        var conn = api.conn;
        if (api.err)
            yield api.return({ 'success': false, 'msg': 'Failed to connect to database.' });

        var count = yield conn.collection("testSet").count({}, api.next);
        if (api.err)
            yield api.return({ 'success': false, 'msg': 'Unable to run the query.' });

        yield api.return(null, { 'success': true, 'data': { 'count': count } });
    }, function (err, data, api) {
        var conn = api.conn;
        var back = api.back;

        // Just close the connection as complete the query.
        if (conn != null)
            conn.close();

        // Return the error.
        if (err) {
            back(json.stringify(err));
            return;
        }

        // Anything is alright, return the data.
        back(json.stringify(data));
    });
})
```

## Compatibility
This repository can only be used in ES 6, for the generate function and `yield` only supported by ES 6.

## Problem
Q1: Why not to use CO?
A1: Well…

Q2: Why no to use Promise?
A2: Err…

Q3: Why not to use RxJS?
A3: Hehe…

Q4: Why not to use blablabla…?
A4: Okay, that my mistake… I used to code as that.

Q5: Will it be updated in the future?
A5: I will fix the bug (maybe). For the new feature, like `promise.all`, well…I have not decided on its form.