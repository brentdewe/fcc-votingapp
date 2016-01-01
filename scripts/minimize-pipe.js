'use strict';

var Minimize = require('minimize');
var minimize = new Minimize();

var chunks = [];
process.stdin.on('data', function(chunk) {
	chunks.push(chunk);
});
process.stdin.on('end', function() {
	var html = Buffer.concat(chunks).toString();
	minimize.parse(html, function(err, minimized) {
		if (err) {
			process.stderr.write(err);
			process.exit(1);
		} else {
			process.stdout.write(minimized);
			process.exit(0);
		}
	});
});
