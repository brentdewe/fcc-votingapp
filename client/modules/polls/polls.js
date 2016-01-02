(function() {

var polls = angular.module('polls', ['ngRoute']);

polls.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/polls', {
		templateUrl: '/modules/polls/list.html',
		controller: 'PollsCtrl'
	})
	.when('/polls/owned', {
		templateUrl: '/modules/polls/list.html',
		controller: 'OwnedPollsCtrl'
	})
	.when('/polls/create', {
		templateUrl: '/modules/polls/create.html',
		controller: 'PollCreateCtrl'
	})
	.when('/polls/:id', {
		templateUrl: '/modules/polls/detail.html',
		controller: 'PollDetailCtrl'
	});
}]);


polls.controller('PollsCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('/api/polls').then(function(res) {
		$scope.polls = res.data;
	});
}]);


polls.controller('OwnedPollsCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('/api/polls?owned=1').then(function(res) {
		$scope.polls = res.data;
	});
}]);


polls.controller('PollCreateCtrl', ['$scope', '$http',
 function($scope, $http) {
	$scope.poll = {};
	$scope.poll.items = [];
	$scope.itemCount = 0;

	$scope.submit = function(poll) {
		$http.post('/api/polls', poll);
	}
}]);

polls.controller('PollDetailCtrl', ['$http', '$scope', '$routeParams',
 function($http, $scope, $routeParams) {
	$http.get('/api/polls/' + $routeParams.id)
	.then(function(response) {
		var poll = response.data;
		var totalVotes = poll.items.reduce(function(sum, item) {
			return sum + item.votes;
		}, 0);
		poll.items.forEach(function(item) {
			if (totalVotes == 0) {
				item.percentage = 0;
			} else {
				item.percentage = item.votes / totalVotes;
			}
		});
		$scope.poll = poll;
	});

	$scope.delete = function(poll) {
		$http.delete('/api/polls/' + poll._id);
	}
}]);


polls.directive('itemList', ['$compile', function($compile) {
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
