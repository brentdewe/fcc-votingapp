(function() {

var app = angular.module('app', ['auth', 'login', 'polls', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: '/modules/start.html'
	});
}]);

app.controller('AppCtrl', ['$scope', 'auth', function($scope, auth) {
	auth.checkAuthentication();
	$scope.currentUser = auth.currentUser;
	$scope.isAuthenticated = auth.isAuthenticated;
}]);

})();
