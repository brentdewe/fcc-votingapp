'use strict';

var mongoose = require('mongoose');

var Poll = require('../models/poll');

module.exports = function() {

	this.findAll = function(req, res, next) {
		Poll.find(function(err, polls) {
			if (err) { return next(err); }
			res.json(polls);
		});
	}

	this.findOwned = function(req, res, next) {
		Poll.find({ owner: req.user.id }, function(err, polls) {
			if (err) {
				return next(err);
			}
			res.json(polls);
		})
	}

	this.create = function(req, res, next) {
		req.body.owner = req.user._id;
		new Poll(req.body).save(function(err, poll) {
			if (err) {
				return next(err);
			}
			res.json(poll);
		});
	}
}
