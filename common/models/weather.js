var request = require('request');
var qs = require('querystring');
var weathpath = '/apistore/weatherservice/recentweathers?';


module.exports = function (Weather) {

    Weather.getWeather = function getWeather(cityid, cityname, cb) {
        //1.dopost baidu api
        //2.把获取到的json放到数据库中,每天8点更新
        setdata(cityid, cityname,cb);


        //Weather.findOne({where: {_id: cityid}}, function (err, result) {
        //    if (result) {
        //        console.log(result.returndata);
        //        cb(null, result.returndata);
        //    }
        //});

    };

    var setdata = function set(cityid, cityname,cb) {
        var data = {
            cityname: '北京',
            cityid: '101010100'
            //time: new Date().getTime()
        };//这是需要提交的数据
        data.cityid = cityid;
        data.cityname = cityname;

        var content = qs.stringify(data);
        var options = {
            url: 'https://apis.baidu.com' + weathpath + content,
            method: 'GET',
            headers: {
                'User-Agent': 'request',
                'apikey': '9ac32c4392b24b3397c0b6fe7d166039'
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                var cityid = info.retData.cityid;
                var json = {"cityid": cityid, "returndata": JSON.stringify(info.retData)};
                console.log(JSON.stringify(json) + " retData");
                Weather.upsert(json, function (err, result) {
                    if (result) {
                        console.log(result.returndata);
                        cb(null, result.returndata);
                        //todo:发送极光push给服务器,告知天气情况;
                    }
                });
            }
        }
        request(options, callback);
    };



    //}, 24 * 60 * 60 * 1000);
    //}, 3 * 1000);


    Weather.remoteMethod('getWeather', {
        //isStatic: false,

        accepts: [
            {arg: 'cityid', type: 'string'},
            {arg: 'cityname', type: 'string'}

        ],

        returns: [
            {arg: 'weather', type: 'object'}
        ],

        http: {path: '/getWeather', verb: 'get'}
    });

};
