(function() {

var pollsApp = angular.module('pollsApp', ['ngRoute']);

pollsApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/all', {
		templateUrl: 'partials/list.html',
		controller: 'AllPollsCtrl'
	})
	.when('/owned', {
		templateUrl: 'partials/list.html',
		controller: 'OwnedPollsCtrl'
	})
	.otherwise({
		redirectTo: '/all'
	});
}]);

pollsApp.controller('AllPollsCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('/api/polls/all').then(function(res) {
		$scope.polls = res.data;
	});
}]);

pollsApp.controller('OwnedPollsCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('/api/polls/owned').then(function(res) {
		$scope.polls = res.data;
	});
}]);

})();
