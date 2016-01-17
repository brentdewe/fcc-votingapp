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
	})
	.when('/polls/:id/edit', {
		templateUrl: '/modules/polls/create.html',
		controller: 'PollsEditCtrl'
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


polls.controller('PollCreateCtrl', ['$scope', '$http', '$location',
 function($scope, $http, $location) {
	$scope.poll = { items: [] };

	$scope.submit = function(poll) {
		$http.post('/api/polls', poll)
		.then(function(response) {
			$location.path('/polls/' + response.data._id);
		});
	}
}]);

polls.controller('PollDetailCtrl', ['$http', '$scope', '$routeParams', '$location',
function($http, $scope, $routeParams, $location) {

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

	$scope.poll = {};
	$http.get('/api/polls/' + $routeParams.id)
	.then(function(response) {
		var poll = response.data;
		addVotePercentages(poll);
		$scope.poll = poll;
	});
	if ($scope.isAuthenticated()) {
		$http.get('/api/polls/' + $routeParams.id + '/vote')
		.then(function(response) {
			$scope.hasVoted = true;
		});
	} else {
		$scope.hasVoted = (localStorage
			&& localStorage.getItem('vote-' + $routeParams.id));
	}

	$scope.vote = function(poll) {
		if (poll.vote) {
			$http.post('/api/polls/' + poll._id + '/vote/' + poll.vote)
			.then(function(response) {
				$scope.hasVoted = true;
				addVotePercentages(response.data);
				$scope.poll = response.data;
				if (!$scope.isAuthenticated() && localStorage) {
					localStorage.setItem('vote-' + $routeParams.id, true);
				}
			});
		}
	}

	$scope.delete = function(poll) {
		$http.delete('/api/polls/' + poll._id)
		.then(function() {
			$location.path('/polls');
		});
	}

	$scope.ownsPoll = function(poll) {
		if (!$scope.currentUser()) {
			return false;
		}
		return poll.owner == $scope.currentUser()._id;
	}

	$scope.edit = function() {
		$location.path($location.path() + '/edit');
	}
}]);


polls.controller('PollsEditCtrl', ['$scope', '$http', '$routeParams', '$location',
function($scope, $http, $routeParams, $location) {
	var pollUrl = '/api/polls/' + $routeParams.id;
	$http.get(pollUrl)
	.then(function(response) {
		if (response.status == 200) {
			$scope.poll = response.data;
		}
	});

	$scope.submit = function(poll) {
		$http.put(pollUrl, poll)
		.then(function() {
			$location.path('/polls/' + poll._id);
		});
	}
}]);

})();
