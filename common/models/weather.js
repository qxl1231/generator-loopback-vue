var http = require('http');
var qs = require('querystring');
var data = {
    cityname: '无锡',
    //time: new Date().getTime()
};//这是需要提交的数据


var content = qs.stringify(data);
var options = {
    hostname: 'http://apis.baidu.com',
    //port: 10086,
    path: '/apistore/weatherservice/citylist?' + content,
    method: 'GET',
    headers: {
        //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        'apikey': '9ac32c4392b24b3397c0b6fe7d166039'
    }
};

module.exports = function (Weather) {

    Weather.getWeather = function getWeather() {
        //1.dopost baidu api
        //2.把获取到的json放到数据库中,每天8点更新

    };


    setInterval(function () {
        //you task here
        //http.setHeader('apikey', '9ac32c4392b24b3397c0b6fe7d166039');

        var req = http.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });

        req.end();
    }, 1 * 60 * 60 * 1000);

};
