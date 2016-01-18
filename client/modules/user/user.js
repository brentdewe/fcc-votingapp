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


user.controller('UserProfileCtrl', ['auth', '$location', '$scope', '$http',
function(auth, $location, $scope, $http) {
	if (!auth.isAuthenticated()) {
		$location.path('/');
	}

	$scope.deleteUser = function() {
		$http.delete('/api/users/me')
		.then(function() {
			auth.logout();
			$location.path('/');
		});
	}
}]);

})();
