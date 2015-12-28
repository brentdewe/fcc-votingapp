'use strict';

var mongoose = require('mongoose');
var errors = require('../lib/http-errors');

var Poll = require('../models/poll');

module.exports = function() {

	/**
	 * Cast the id to an ObjectId using a promise.
	 */
	function toObjectId(id) {
		return new Promise(function(resolve) {
			resolve(mongoose.Types.ObjectId(id));
		});
	}

	/**
	 * Return a promise that rejects with a NotFoundError.
	 */
	function NotFoundPromise() {
		return Promise.reject(new errors.NotFound);
	}

	/**
	 * Return a promise resolving to the poll with the given id, or rejecting
	 * with a NotFoundError or mongoose error.
	 */
	function findPoll(id) {
		return toObjectId(id)
		.catch(NotFoundPromise)
		.then(Poll.findById.bind(Poll))
		.then(function(poll) {
			if (!poll) {
				return NotFoundPromise();
			}
			return poll;
		});
	}

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

	this.findId = function(req, res, next) {
		findPoll(req.params.id)
		.then(res.json.bind(res))
		.catch(next);
	}

	this.removeId = function(req, res, next) {
		findPoll(req.params.id)
		.then(function(poll) {
			if (poll.owner != req.user.id) {
				return NotFoundPromise();
			}
			return poll;
		})
		.then(poll => poll.remove())
		.then((poll) => res.status(204).end())
		.catch(next);
	}
}
