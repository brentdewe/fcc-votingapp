'use strict';

var mongoose = require('mongoose');

var user = mongoose.Schema({
	github: {
		id: String,
		username: String,
		displayname: String
	}
});

module.exports = mongoose.model('User', user);
