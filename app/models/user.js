'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');

var user = mongoose.Schema({
	github: {
		id: String,
		username: String,
		displayname: String
	},
	password: {
		username: String,
		salt: String,
		hash: String
	}
});

function hash(password, salt, callback) {
	crypto.pbkdf2(password, salt, 50000, 256, 'sha256', callback);
}

user.methods.setPassword = function(password, salt, callback) {
	var obj = this;
	hash(password, salt, function(err, key) {
		if (!err) {
			obj.password.salt = salt;
			obj.password.hash = key.toString('base64');
		}
		callback(err, obj);
	});
}

user.methods.verifyPassword = function(password, callback) {
	var obj = this;
	hash(password, this.password.salt, function(err, key) {
		if (!err && key.toString('base64') == obj.password) {
			callback(null, true);
		} else {
			callback(err, false);
		}
	})
}

module.exports = mongoose.model('User', user);
