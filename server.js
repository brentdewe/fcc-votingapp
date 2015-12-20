'use strict';

var express = require('express');
var mongoose = require('mongoose');

require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);

var app = express();

require('./app/routes')(app);

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port + '...');
});
