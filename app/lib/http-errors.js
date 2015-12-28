'use strict';

var util = require('util');

function createErrorClass(name) {
	var errClass = function() {
		Error.captureStackTrace(this, this.constructor);
		this.name = name;
	}
	util.inherits(errClass, Error);
	return errClass;
}

module.exports = {
	Forbidden: createErrorClass('ForbiddenError'),
	NotFound: createErrorClass('NotFoundError')
}
