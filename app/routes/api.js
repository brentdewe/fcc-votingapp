'use strict';

var router = require('express').Router();

function requireLoginForApi(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.json(null);
}

var PollsController = require('../controllers/pollsController');
var pollsCtrl = new PollsController();

router.get('/polls/search', requireLoginForApi, pollsCtrl.search);

module.exports = router;
