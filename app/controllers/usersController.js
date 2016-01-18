'use strict';

var Poll = require('../models/poll');
var User = require('../models/user');

module.exports = function() {

	this.currentUser = function(req, res) {
		res.json(req.user);
	}

	this.create = function(req, res, next) {
		var user = new User({ 'password.username': req.body.username });
		user.setPassword(req.body.password, function(err) {
			user.save()
			.then(user => {
				console.log(user);
				req.login(user, function() {
					if (err) {
						next(err);
					}
					res.status(201).end();
				});
			})
			.catch(next);
		});
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
