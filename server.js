'use strict';

var express = require('express');

require('dotenv').load();

var app = express();

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port + '...');
});
