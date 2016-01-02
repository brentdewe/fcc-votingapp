'use strict';

var GitHubStrategy = require('passport-github');
var LocalStrategy = require('passport-local');
var User = require('../models/user');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, done);
	});

	passport.use(new GitHubStrategy({
		clientID: process.env.GITHUB_CLIENT_ID,
		clientSecret: process.env.GITHUB_CLIENT_SECRET,
		callbackURL: process.env.APP_URL + '/auth/github/callback'
	}, function(accessToken, refreshToken, profile, done) {
		User.findOne({ 'github.id': profile.id }, function (err, user) {
			if (err) {
				return done(err);
			}
			if (user) {
				return done(null, user);
			}
			new User({ github: {
				id: profile.id,
				username: profile.username,
				displayname: profile.displayName
			}}).save(done);
		})
	}));

	passport.use(new LocalStrategy(function(username, password, done) {
		User.findOne({ 'password.username': username },
				'password.hash password.salt', function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false);
			}
			user.verifyPassword(password, function(err, valid) {
				if (valid) {
					return done(null, user);
				}
				done(err, false);
			});
		})
	}));
}
