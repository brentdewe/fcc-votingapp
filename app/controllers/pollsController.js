'use strict';

var mongoose = require('mongoose');
mongoose.Promise = Promise;
var errors = require('../lib/http-errors');

var Poll = require('../models/poll');
var Vote = require('../models/vote');

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
		if (req.isAuthenticated() && req.query.owned){
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

	this.vote = function(req, res, next) {
		findPoll(req.params.id)
		.then(function(poll) {
			if (req.params.vote >= poll.items.length) {
				return NotFoundPromise();
			}
			var voteQuery = { poll: poll._id, user: req.user._id };
			return Vote.findOne(voteQuery)
			.then(function(vote) {
				if (vote) {
					res.status(409).json({ err: 'Already voted' });
				} else {
					return new Vote(voteQuery).save()
					.then(function(vote) {
						++poll.items[req.params.vote].votes;
						return poll.save()
						.then(poll => res.json(poll))
						.catch(err => {
							vote.remove();
							return err;
						});
					});
				}
			});
		})
		.catch(next);
	}
}
