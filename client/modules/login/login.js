(function() {

var login = angular.module('login', ['ngRoute']);

login.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/login', {
		templateUrl: '/modules/login/login.html',
	});
}]);

})();
