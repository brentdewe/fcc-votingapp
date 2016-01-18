(function() {

var user = angular.module('user', ['ngRoute']);

user.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/login', {
		templateUrl: '/modules/user/login.html',
	})
	.when('/profile', {
		templateUrl: '/modules/user/profile.html',
		controller: 'UserProfileCtrl'
	});
}]);


user.controller('UserProfileCtrl', ['$scope', '$location',
function($scope, $location) {
	if (!$scope.isAuthenticated()) {
		$location.path('/');
	}
}]);

})();
