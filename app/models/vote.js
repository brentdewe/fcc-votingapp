'use strict';

var mongoose = require('mongoose');

var vote = mongoose.Schema({
	poll: mongoose.Schema.ObjectId,
	user: mongoose.Schema.ObjectId
});

module.exports = mongoose.model('Vote', vote);
