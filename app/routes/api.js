'use strict';

var router = require('express').Router();

function requireLogin(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).end();
	}
}

var PollsController = require('../controllers/pollsController');
var pollsCtrl = new PollsController();

router.get('/polls/all', pollsCtrl.findAll);

router.get('/polls/owned', requireLogin, pollsCtrl.findOwned);

module.exports = router;
