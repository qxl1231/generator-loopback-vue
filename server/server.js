// var loopback = require('loopback');
// var boot = require('loopback-boot');
// var path = require('path');
//
// var app = module.exports = loopback();
//
// app.start = function () {
//     // start the web server
//     return app.listen(function () {
//         app.emit('started');
//         var baseUrl = app.get('url').replace(/\/$/, '');
//         console.log('Web server listening at: %s', baseUrl);
//         if (app.get('loopback-component-explorer')) {
//             var explorerPath = app.get('loopback-component-explorer').mountPath;
//             console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
//         }
//     });
// };
//
// //var staticPath = null;
// //
// //staticPath = path.resolve(__dirname, '../client/');
// //console.log("Running app in development mode");
// //
// //app.use(loopback.static(staticPath));
//
// // Bootstrap the application, configure models, datasources and middleware.
// // Sub-apps like REST API are mounted via boot scripts.
// boot(app, __dirname, function (err) {
//     if (err) throw err;
//
//     // start the server if `$ node server.js`
//     if (require.main === module)
//         app.start();
// });

var loopback = require('loopback');
var boot = require('loopback-boot');

var http = require('http');
var https = require('https');
var sslCert = require('./private/ssl_cert');
var httpsOptions = {
  key: sslCert.privateKey,
  cert: sslCert.certificate
};
var app = module.exports = loopback();

// boot scripts mount components like REST API
boot(app, __dirname);

app.start = function() {
  // start the web server
  // return app.listen(function() {
  //   app.emit('started');
  //   var baseUrl = app.get('url').replace(/\/$/, '');
  //   console.log('Web server listening at: %s', baseUrl);
  //   if (app.get('loopback-component-explorer')) {
  //     var explorerPath = app.get('loopback-component-explorer').mountPath;
  //     console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
  //   }
  // });

  var port = app.get('port');
  var host = app.get('host');
  var httpServer = http.createServer(app).listen(port, host, function() {

    var httpsPort = app.get('https-port');
    var httpsServer = https.createServer(httpsOptions, app).listen(httpsPort,
      host, function() {

        app.emit('started');

        app.close = function(cb) {
          app.removeAllListeners('started');
          app.removeAllListeners('loaded');
          httpServer.close(function() {
            httpsServer.close(cb);
          });
        };
      });
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}