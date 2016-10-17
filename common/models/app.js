module.exports = function (App) {
  App.prototype.checkVersion = function checkVersion(device_deploy_uuid, device_app_version, device_platform, cb) {
    var compatible_binary = false;
    var update_available = false;
    var comp_result = false;
    var zipurl = '';

    this.versions(function (err, results) {
      if (err) {
        return cb(err);
      }
      var bestUpdate = {compatible_binary: false, update_available: false, device_deploy_uuid: '0.0.0', zipurl: '' };

      for (i = 0; i < results.length; i++) {
        var latest_h5 = results[i]['h5Version'];
        var obj = results[i];
        var max = results[i]['binMax'];
        var min = results[i]['binMin'];
        var versionType = results[i]['versionType'];

        if (device_platform.toLowerCase() == versionType.toLowerCase()) {
          var comp_result = compareH5(device_deploy_uuid, device_app_version, latest_h5, max, min, obj);

          if (comp_result.compatible_binary && !bestUpdate.compatible_binary) {
            bestUpdate = comp_result;
          } else if (comp_result.update_available && !bestUpdate.update_available) {
            bestUpdate = comp_result;
          } else if (comp_result.compatible_binary && comp_result.update_available && (compare(comp_result.device_deploy_uuid, bestUpdate.device_deploy_uuid) === 1)){
            bestUpdate = comp_result;
          }
        }
      }

      cb(null, bestUpdate.compatible_binary, bestUpdate.update_available, {uuid: bestUpdate.device_deploy_uuid, url: bestUpdate.zipurl});

    });
  };

  var compareH5 = function compareH5(device_deploy_uuid, device_app_version, latest_h5, max, min, obj, cb) {

    var update = {};
    update.device_deploy_uuid = '';
    update.zipurl = '';
    update.compatible_binary = false;
    update.update_available = false;

    if (compare(device_app_version, min) >= 0 && compare(max, device_app_version) >= 0) {
      update.compatible_binary = true;
      if (compare(latest_h5, device_deploy_uuid) === 1) {
        update.update_available = true;
        update.device_deploy_uuid = latest_h5;
        update.zipurl = obj['url'];
      }
    }

    return update;
  };

  var compare = function compare(v1, v2) {
    var v1_tmp = v1, v2_tmp = v2;
    v1 = v1.replace(/\./g, '');
    v2 = v2.replace(/\./g, '');
    // console.log("去掉小数点：", v1, v2);
    var len = Math.max(v1.length, v2.length);
    v1 = v1 + Array(len - v1.length + 1).join(0);
    v2 = v2 + Array(len - v2.length + 1).join(0);
    // console.log("补长对齐：", v1, v2);
    v1 = parseInt(v1);
    v2 = parseInt(v2);
    // console.log("去掉前导0：", v1, v2);
    // console.log("大的是：", Math.max(v1, v2));
    var ret = v1 > v2 ? 1 : v1 == v2 ? 0 : -1;
    // console.log("compare:", v1_tmp, " ? ", v2_tmp, " : ", ret);
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
