/* jshint node:true */
'use strict';
var app = require('../server');

var dataSource = app.dataSources.appversion;

dataSource.automigrate(function(err){
	if (err) {
		console.log("Migrate model db error:", err);
		return;
	}

	console.log("Migrate model db success");
	dataSource.disconnect(function(err){
		if (err) throw err;
	});
});


