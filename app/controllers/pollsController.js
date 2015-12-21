'use strict';

var mongoose = require('mongoose');

var Poll = require('../models/poll');

module.exports = function() {

	this.search = function(req, res, next) {
		var query = {};
		if (req.query.owner) {
			try {
				query.owner = mongoose.Types.ObjectId(req.query.owner);
			} catch (err) {
				query.owner = null;
			}
		}
		Poll.find(query, function(err, polls) {
			if (err) { return next(err); }
			res.json(polls);
		});
	}
}
