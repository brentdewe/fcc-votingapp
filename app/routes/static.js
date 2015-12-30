'use strict';

var express = require('express');

module.exports = function(app) {
	app.use('/angular.js', express.static(
			'node_modules/angular/angular.min.js'));
	app.use('/angular-route.js', express.static(
			'node_modules/angular-route/angular-route.min.js'));
	app.use('/modules', express.static('client/dist/modules'));

	app.get('/', function(req, res) {
		res.sendFile(process.cwd() + '/client/dist/modules/index.html');
	});
}
