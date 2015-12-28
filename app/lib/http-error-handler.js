'use strict';

var errors = require('../lib/http-errors');

module.exports = function(err, req, res, next) {
	if (err instanceof errors.Forbidden) {
		res.status(403).end();
	}
	else if (err instanceof errors.NotFound) {
		res.status(404).end();
	}
	else {
		next(err);
	}
}
