'use strict';

module.exports = function() {

	this.currentUser = function(req, res) {
		res.json(req.user);
	}
}
