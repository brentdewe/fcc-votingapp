(function() {

var auth = angular.module('auth', ['ngRoute']);

auth.service('session', function() {
	this.user = null;
});

auth.factory('auth', ['$http', 'session', function($http, session) {
	var auth = {};
	auth.checkAuthentication = function() {
		$http.get('/api/users/me')
		.then(function(response) {
			session.user = response.data;
		})
		.catch(function(response) {
			session.user = null;
		});
	}
	auth.isAuthenticated = function() {
		return !!session.user;
	}
	auth.currentUser = function() {
		return session.user;
	}
	return auth;
}]);

})();
