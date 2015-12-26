'use strict';

var mongoose = require('mongoose');

var poll = mongoose.Schema({
	owner: mongoose.Schema.ObjectId,
	title: String,
	description: String,
	items: [{
		text: String,
		votes: { type: Number, default: 0 }
	}]
});

module.exports = mongoose.model('Poll', poll);
