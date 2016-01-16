'use strict';

module.exports = function(app, passport) {

	app.use('/api', require('./api'));

	app.get('/auth/github', passport.authenticate('github'));

	app.get('/auth/github/callback', passport.authenticate('github', {
		successRedirect: '/',
		failureRedirect: '/#/login'
	}));

	app.post('/auth/local', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/#/login'
	}));
}
