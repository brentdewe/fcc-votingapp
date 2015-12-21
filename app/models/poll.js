'use strict';

var mongoose = require('mongoose');

var poll = mongoose.Schema({
	owner: mongoose.Schema.ObjectId,
	title: String,
	description: String,
	items: [{
		text: String,
		votes: Number
	}]
});

module.exports = mongoose.model('Poll', poll);
