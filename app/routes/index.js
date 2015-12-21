'use strict';

var PollsController = require('../controllers/pollsController');

module.exports = function(app, passport) {

	var pollsController = new PollsController();

	app.get('/api/polls/search', pollsController.search);

	app.get('/auth/github', passport.authenticate('github'));

	app.get('/auth/github/callback', passport.authenticate('github', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));
}
