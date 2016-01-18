(function() {

var user = angular.module('user', ['ngRoute']);

user.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/signup', {
		templateUrl: '/modules/user/signup.html',
		controller: 'NewUserCtrl'
	})
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


user.controller('NewUserCtrl', ['$scope', '$http', '$location', 'auth',
function($scope, $http, $location, auth) {
	$scope.user = {}

	$scope.submit = function(user) {
		$http.post('/api/users', user)
		.then(function() {
			auth.checkAuthentication();
			$location.path('/');
		});
	}
}]);

})();
