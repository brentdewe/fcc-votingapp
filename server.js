'use strict';

var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');

require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);

var app = express();

require('./app/config/passport')(passport);
app.use(session({
	resave: false,
	saveUninitialized: true,
	secret: process.env.SESSION_SECRET,
	store: new MongoDBStore({
		uri: process.env.MONGO_URI,
		collection: 'sessions'
	})
}));
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes')(app, passport);

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port + '...');
});
