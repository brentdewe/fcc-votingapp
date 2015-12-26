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
	.when('/create', {
		templateUrl: 'partials/create.html',
		controller: 'PollCreateCtrl'
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


pollsApp.controller('PollCreateCtrl', ['$scope', '$http',
 function($scope, $http) {
	$scope.poll = {};
	$scope.poll.items = [];
	$scope.itemCount = 0;

	$scope.submit = function(poll) {
		$http.post('/api/polls/add', poll);
	}
}]);


pollsApp.directive('itemList', ['$compile', function($compile) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.find('button').bind('click', function() {
				var html = '<li><input type="text" ng-model="poll.items['
					+ scope.itemCount + '].text"></li>';
				var compiled = $compile(angular.element(html))(scope);
				element.find('ul').append(compiled);

				scope.poll.items.push({});
				++scope.itemCount;
			});
		}
	};
}]);

})();
