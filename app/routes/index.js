'use strict';

var PollsController = require('../controllers/pollsController');

module.exports = function(app, passport) {

	var pollsController = new PollsController();

	function requireLoginForApi(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.json(null);
	}

	app.get('/login', function(req, res) { res.redirect('/login.html') });

	app.get('/api/polls/search', requireLoginForApi, pollsController.search);

	app.get('/auth/github', passport.authenticate('github'));

	app.get('/auth/github/callback', passport.authenticate('github', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));

	app.post('/auth/local', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));
}
