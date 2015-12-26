'use strict';

var mongoose = require('mongoose');

var item = mongoose.Schema({
	text: String,
	votes: { type: Number, default: 0 }
}, { _id: false });

var poll = mongoose.Schema({
	owner: mongoose.Schema.ObjectId,
	title: String,
	description: String,
	items: [item]
});

module.exports = mongoose.model('Poll', poll);
