'use strict';

module.exports = function(app, passport) {

	var views = process.cwd() + '/app/views/';

	app.get('/', function(req, res) {
		res.sendFile(views + 'index.html');
	});

	app.get('/auth/github', passport.authenticate('github'));

	app.get('/auth/github/callback', passport.authenticate('github', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));
}
