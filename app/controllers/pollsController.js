'use strict';

var mongoose = require('mongoose');

var Poll = require('../models/poll');

module.exports = function() {

	this.find = function(req, res, next) {
		var query = {};
		if (req.query.owned){
			query.owner = req.user._id;
		}
		Poll.find(query).then(res.json.bind(res), next);
	}

	this.create = function(req, res, next) {
		req.body.owner = req.user._id;
		new Poll(req.body).save().then(function(poll) {
			res.status(201).json(poll);
		}, next);
	}
}
