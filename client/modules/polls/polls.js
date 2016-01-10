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

	function addVotePercentages(poll) {
		var totalVotes = poll.items.reduce(function(sum, item) {
			return sum + item.votes;
		}, 0);
		if (totalVotes == 0) {
			poll.items.forEach(function(item) { item.percentage = 0 });
		} else {
			poll.items.forEach(function(item) {
				item.percentage = item.votes / totalVotes;
			});
		}
	}

	$http.get('/api/polls/' + $routeParams.id)
	.then(function(response) {
		var poll = response.data;
		addVotePercentages(poll);
		$scope.poll = poll;
	});
	$http.get('/api/polls/' + $routeParams.id + '/vote')
	.then(function(response) {
		$scope.hasVoted = 200 <= response.status && response.status < 300;
	});

	$scope.vote = function(poll) {
		if (poll.vote) {
			$http.post('/api/polls/' + poll._id + '/vote/' + poll.vote)
			.then(function(response) {
				if (response.status == 200) {
					$scope.hasVoted = true;
					addVotePercentages(response.data);
					$scope.poll = response.data;
				}
			});
		}
	}

	$scope.delete = function(poll) {
		$http.delete('/api/polls/' + poll._id);
	}

	$scope.ownsPoll = function(poll) {
		return poll.owner == $scope.currentUser()._id;
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
