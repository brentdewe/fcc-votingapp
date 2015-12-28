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

router.get('/polls', pollsCtrl.find);
router.post('/polls', requireLogin, pollsCtrl.create);
router.get('/polls/:id', pollsCtrl.findId);
router.delete('/polls/:id', requireLogin, pollsCtrl.removeId);

router.use(require('../lib/http-error-handler'));

module.exports = router;
