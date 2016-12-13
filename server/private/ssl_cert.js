// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: strong-gateway
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

var crypto = require('crypto');
var tls = require('tls');
var fs = require('fs');
var path = require('path');

exports.privateKey = fs.readFileSync(path.join(__dirname, 'privatekey.pem'))
  .toString();
exports.certificate = fs.readFileSync(path.join(__dirname, 'certificate.pem'))
  .toString();

if (typeof tls.createSecureContext === 'function') {
  exports.credentials = tls.createSecureContext(
    {key: exports.privateKey, cert: exports.certificate});
} else {
  exports.credentials = crypto.createCredentials(
    {key: exports.privateKey, cert: exports.certificate});
}
