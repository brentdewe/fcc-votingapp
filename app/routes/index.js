'use strict';

var PollsController = require('../controllers/pollsController');

module.exports = function(app, passport) {

	var pollsController = new PollsController();

	app.get('/login', function(req, res) { res.redirect('/login.html') });

	app.get('/api/polls/search', pollsController.search);

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
