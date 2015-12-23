var request = require('request');
var qs = require('querystring');
var JPush = require('jpush-sdk');
var citypath = '/apistore/weatherservice/citylist?';



module.exports = function (City) {


    City.getCity = function getCity(cityname, cb) {

        getBaiduCity(cityname);
        City.find({where: {district_cn: cityname}}, function (err, result) {
            if (result) {
                console.log(result);
                cb(null, result);
            }
        });

    };

    //setInterval(function (cityname) {
    var getBaiduCity=function getBaiduCity (cityname) {
        var data = {
            cityname: '北京'
            //time: new Date().getTime()
        };//这是需要提交的数据
        data.cityname = cityname;
        var content = qs.stringify(data);

        var options = {
            url: 'https://apis.baidu.com' + citypath + content,
            method: 'GET',
            headers: {
                'User-Agent': 'request',
                'apikey': '9ac32c4392b24b3397c0b6fe7d166039'
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                var cityList = info.retData;
                console.log(info.retData[0].area_id + " area_id");
                console.log(JSON.stringify(cityList) + " cityList");

                for (var i in cityList) {
                    city = cityList[i];
                    console.log(JSON.stringify(city));
                    City.upsert(city, function (err, result) {
                        if (result) {

                            //todo:发送极光push给服务器,告知天气情况;
                            var client = JPush.buildClient('0a5dc687bbb60c9f25a04143', 'ba1b55af1daad6b18ebb5bdc');

                            //easy push
                            client.push().setPlatform(JPush.ALL)
                                .setAudience(JPush.ALL)
                                .setNotification('城市推送测试', JPush.ios('ios alert', 'happy', 5))
                                .send(function (err, res) {
                                    if (err) {
                                        console.log(err.message);
                                    } else {
                                        console.log('Sendno: ' + res.sendno);
                                        console.log('Msg_id: ' + res.msg_id);
                                    }
                                });
                        }
                    });
                }

            }
        }

        request(options, callback);

        //}, 24 * 60 * 60 * 1000);
    }
    //}, 2 * 1000);

    City.remoteMethod('getCity', {
        //isStatic: false,

        accepts: [
            {arg: 'cityname', type: 'string'}
        ],

        returns: [
            {arg: 'city', type: 'object'}

        ],

        http: {path: '/getCity', verb: 'get'}
    });

};
