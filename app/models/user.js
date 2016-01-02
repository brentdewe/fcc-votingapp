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
		salt: { type: String, select: false },
		hash: { type: String, select: false }
	}
});

function hash(password, salt, callback) {
	crypto.pbkdf2(password, salt, 20000, 256, 'sha256', callback);
}

user.methods.setPassword = function(password, callback) {
	crypto.randomBytes(64, (err, salt) => {
		salt = salt.toString('base64');
		hash(password, salt, (err, key) => {
			if (!err) {
				this.password.salt = salt;
				this.password.hash = key.toString('base64');
			}
			callback(err, this);
		});
	});
}

user.methods.verifyPassword = function(password, callback) {
	hash(password, this.password.salt, (err, key) => {
		if (!err && key.toString('base64') == this.password.hash) {
			callback(null, true);
		} else {
			callback(err, false);
		}
	})
}

module.exports = mongoose.model('User', user);
