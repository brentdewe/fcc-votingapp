var pollsApp = angular.module('pollsApp', []);

pollsApp.controller('PollsCtrl', ['$scope', function($scope) {
	$scope.polls = [{
		"_id":"56785579c16682f00b3661aa",
		"title":"Test poll",
		"description":"poll to test",
		"owner":"567845e11689918b0316043f",
		"items":[
			{"text":"option one","votes":0},
			{"text":"option two","votes":1}
		]
	}];
}]);
