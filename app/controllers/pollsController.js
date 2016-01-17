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

	function ForbiddenPromise() {
		return Promise.reject(new errors.Forbidden);
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

	this.update = function(req, res, next) {
		findPoll(req.params.id)
		.then(function(poll) {
			if (poll.owner != req.user.id) {
				return ForbiddenPromise();
			}
			poll.set(req.body);
			return poll.save();
		})
		.then(() => res.status(204).end())
		.catch(next);
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
				return ForbiddenPromise();
			}
			return poll;
		})
		.then(poll => poll.remove())
		.then((poll) => res.status(204).end())
		.catch(next);
	}

	this.vote = function(req, res, next) {
		function incVotes(poll, vote) {
			++poll.items[vote].votes;
			return poll.save()
			.then(poll => res.json(poll));
		}
		findPoll(req.params.id)
		.then(function(poll) {
			if (req.params.vote >= poll.items.length) {
				return NotFoundPromise();
			}
			if (!req.isAuthenticated()) {
				return incVotes(poll, req.params.vote);
			}
			var voteQuery = { poll: poll._id, user: req.user._id };
			return Vote.findOne(voteQuery)
			.then(function(vote) {
				if (vote) {
					res.status(409).json({ err: 'Already voted' });
				} else {
					return new Vote(voteQuery).save()
					.then(function(vote) {
						incVotes(poll, req.params.vote)
						.catch(err => {
							vote.remove();
							throw err;
						});
					});
				}
			});
		})
		.catch(next);
	}

	this.hasVoted = function(req, res, next) {
		findPoll(req.params.id)
		.then(poll => Vote.findOne({ poll: poll._id, user: req.user._id }))
		.then(function(vote) {
			if (vote) {
				res.status(204).end();
			} else {
				res.status(404).end();
			}
		})
		.catch(next);
	}
}
