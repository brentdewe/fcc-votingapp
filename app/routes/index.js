'use strict';

module.exports = function(app) {

	var views = process.cwd() + '/app/views/';

	app.get('/', function(req, res) {
		res.sendFile(views + 'index.html');
	});
}
