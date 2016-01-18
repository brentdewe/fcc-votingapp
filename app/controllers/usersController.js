'use strict';

var Poll = require('../models/poll');

module.exports = function() {

	this.currentUser = function(req, res) {
		res.json(req.user);
	}

	this.delete = function(req, res, next) {
		Poll.remove({ owner: req.user._id })
		.then(function() {
			return req.user.remove()
			.then(function() {
				req.logout();
				res.status(204).end();
			});
		})
		.catch(next);
	}
}
