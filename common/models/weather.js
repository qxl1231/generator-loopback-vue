var request = require('request');
var JPush = require('jpush-sdk');
var qs = require('querystring');
var weathpath = '/apistore/weatherservice/recentweathers?';


module.exports = function (Weather) {

    Weather.getWeather = function getWeather(cityid, cityname, cb) {
        //1.dopost baidu api
        //2.把获取到的json放到数据库中,每天8点更新
        setdata(cityid, cityname, cb);

    };

    var setdata = function set(cityid, cityname, cb) {
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
        request(options, callback);

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                var cityid = info.retData.cityid;
                var json = {"cityid": cityid, "returndata": JSON.stringify(info.retData)};
                //console.log(JSON.stringify(json) + " retData");
                Weather.upsert(json, function (err, result) {
                    if (result) {
                        console.log(result.returndata);
                        //todo:发送极光push给服务器,告知天气情况;
                        var client = JPush.buildClient('0a5dc687bbb60c9f25a04143', 'ba1b55af1daad6b18ebb5bdc');

                        //easy push
                        client.push().setPlatform(JPush.ALL)
                            .setAudience(JPush.ALL)
                            .setNotification('天气推送测试', JPush.ios('ios alert', 'happy', 5))
                            .send(function (err, res) {
                                if (err) {
                                    console.log(err.message);
                                } else {
                                    console.log('Sendno: ' + res.sendno);
                                    console.log('Msg_id: ' + res.msg_id);
                                }
                            });
                        cb(null, result.returndata);

                    }
                });
            }
        }

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
