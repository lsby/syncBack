var run = require('../index').run;
var fs = require('fs');

run(function* (api) {
    var exists = yield fs.exists('./README.md', api.nextOne);
    if (!exists)
        api.return('文件不存在');

    var data = yield fs.readFile('./README.md', api.next);
    if (api.err)
        api.return('读文件失败', api.err);

    api.return(null, data);
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