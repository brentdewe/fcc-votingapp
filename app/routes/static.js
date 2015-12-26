'use strict';

var express = require('express');

module.exports = function(app) {
	app.use('/angular.min.js', express.static(
			'node_modules/angular/angular.min.js'));
	app.use('/angular-route.min.js', express.static(
			'node_modules/angular-route/angular-route.min.js'));
	app.use('/controllers', express.static('public/controllers'));
	app.use('/', express.static('public/views'));
}
