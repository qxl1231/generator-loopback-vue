module.exports = function (App) {
    App.prototype.checkVersion = function checkVersion(device_deploy_uuid, device_app_version, device_platform, cb) {
        //uuid=compare h5version,app_version= in(min,max)
        var compatible_binary = false;
        var update_available = false;
        var comp_result = false;
        //var uuid = '';
        var zipurl = '';
        //console.log(this.versions.find({ where: {device_platform:'versionType'}})) ;
        this.versions(function (err, results) {
            //console.log(results);
            for (i = 0; i < results.length; i++) {
                console.log('h5Version:' + results[i]['h5Version']);
                console.log('max:' + results[i]['binMax']);
                console.log('min:' + results[i]['binMin']);
                console.log('uuid:' + device_deploy_uuid + 'appver:' + device_app_version);
                var latest_h5 = results[i]['h5Version'];
                var obj = results[i];
                var max = results[i]['binMax'];
                var min = results[i]['binMin'];
                var versionType = results[i]['versionType'];
                //todo:好像少了个判断
                if (device_platform == versionType) {
                    comp_result = compareH5(device_deploy_uuid, device_app_version, latest_h5, max, min, obj, cb);
                } else {
                    cb(null, compatible_binary, update_available, {uuid: device_deploy_uuid, url: zipurl});

                }

            }
        });


        var compareH5 = function compareH5(device_deploy_uuid, device_app_version, latest_h5, max, min, obj, cb) {

            //if (parseInt(latest_h5) > parseInt(uuid)) {
            if (compare(latest_h5, device_deploy_uuid) === 1) {
                //if (parseInt(min) <= parseInt(app_version) && parseInt(app_version) <= parseInt(max)) {
                if (compare(device_app_version, min) === 1 && compare(max, device_app_version) === 1) {
                    device_deploy_uuid = latest_h5;
                    console.log(obj);
                    zipurl = obj['url'];

                    console.log('zurl:' + zipurl);
                    compatible_binary = true;
                    update_available = true;
                    console.log('compatible_binary:' + compatible_binary);
                    console.log('update_available:' + update_available);

                    cb(null, compatible_binary, update_available, {uuid: latest_h5, url: zipurl});

                    return true;
                } else {
                    device_deploy_uuid = latest_h5;
                    compatible_binary = true;
                    update_available = false;

                    cb(null, compatible_binary, update_available, {uuid: device_deploy_uuid, url: zipurl});

                    return false;
                }
            } else {

                cb(null, compatible_binary, update_available, {uuid: device_deploy_uuid, url: zipurl});
                return false;
            }

        };


    };


    var compare = function compare(v1, v2) {
        var v1_tmp = v1, v2_tmp = v2;
        v1 = v1.replace(/\./g, '');
        v2 = v2.replace(/\./g, '');
        console.log("去掉小数点：", v1, v2);
        var len = Math.max(v1.length, v2.length);
        v1 = v1 + Array(len - v1.length + 1).join(0);
        v2 = v2 + Array(len - v2.length + 1).join(0);
        console.log("补长对齐：", v1, v2);
        v1 = parseInt(v1.replace(/^0+/, ''));
        v2 = parseInt(v2.replace(/^0+/, ''));
        console.log("去掉前导0：", v1, v2);
        console.log("大的是：", Math.max(v1, v2));
        var ret = v1 > v2 ? 1 : v1 == v2 ? 0 : -1;
        console.log("compare:", v1_tmp, " ? ", v2_tmp, " : ", ret);
        return ret;
    }


    App.remoteMethod('checkVersion', {
        isStatic: false,

        accepts: [
            {arg: 'device_deploy_uuid', type: 'string'},
            {arg: 'device_app_version', type: 'string'},
            {arg: 'device_platform', type: 'string'}
        ],

        returns: [
            {arg: 'compatible_binary', type: 'boolean'},
            {arg: 'update_available', type: 'boolean'},
            {arg: 'update', type: 'object'}
        ],

        http: {path: '/updates/check', verb: 'post'}
    });
};
