(function() {

var pollsApp = angular.module('pollsApp', []);

pollsApp.controller('PollsCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('/api/polls/search').then(function(res) {
		$scope.polls = res.data;
	});
}]);

})();
